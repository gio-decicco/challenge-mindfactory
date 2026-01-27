import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SujetoService } from './sujeto.service';
import { SujetoEntity } from '../domain/sujeto.entity';
import { CreateSujetoDto } from './dto/create-sujeto.dto';

describe('SujetoService', () => {
  let service: SujetoService;
  let repository: Repository<SujetoEntity>;

  const mockSujeto: SujetoEntity = {
    id: '1',
    cuit: '20436072180',
    denominacion: 'Juan Pérez SRL',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateDto: CreateSujetoDto = {
    cuit: '20436072180',
    denominacion: 'Juan Pérez SRL',
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SujetoService,
        {
          provide: getRepositoryToken(SujetoEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SujetoService>(SujetoService);
    repository = module.get<Repository<SujetoEntity>>(
      getRepositoryToken(SujetoEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new sujeto successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSujeto);
      mockRepository.save.mockResolvedValue(mockSujeto);

      const result = await service.create(mockCreateDto);

      expect(result).toEqual(mockSujeto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cuit: mockCreateDto.cuit },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        cuit: mockCreateDto.cuit,
        denominacion: mockCreateDto.denominacion,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockSujeto);
    });

    it('should throw Error when sujeto with same CUIT already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockSujeto);

      await expect(service.create(mockCreateDto)).rejects.toThrow(Error);
      await expect(service.create(mockCreateDto)).rejects.toThrow(
        'Sujeto con ese CUIT ya existe',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cuit: mockCreateDto.cuit },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create sujeto with different CUIT', async () => {
      const differentDto: CreateSujetoDto = {
        cuit: '27123456789',
        denominacion: 'María González SA',
      };
      const differentSujeto = { ...mockSujeto, cuit: differentDto.cuit, denominacion: differentDto.denominacion };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(differentSujeto);
      mockRepository.save.mockResolvedValue(differentSujeto);

      const result = await service.create(differentDto);

      expect(result).toEqual(differentSujeto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cuit: differentDto.cuit },
      });
    });
  });

  describe('findByCuit', () => {
    it('should return sujeto when found by CUIT', async () => {
      mockRepository.findOne.mockResolvedValue(mockSujeto);

      const result = await service.findByCuit('20436072180');

      expect(result).toEqual(mockSujeto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cuit: '20436072180' },
      });
    });

    it('should return null when sujeto does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByCuit('99999999999');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cuit: '99999999999' },
      });
    });

    it('should call repository with correct CUIT parameter', async () => {
      const cuit = '20436072180';
      mockRepository.findOne.mockResolvedValue(mockSujeto);

      await service.findByCuit(cuit);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cuit: cuit },
      });
    });
  });
});
