import { Test, TestingModule } from '@nestjs/testing';
import { SujetoController } from './sujeto.controller';
import { SujetoService } from '../application/sujeto.service';
import { CreateSujetoDto } from '../application/dto/create-sujeto.dto';
import { SujetoEntity } from '../domain/sujeto.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SujetoController', () => {
  let controller: SujetoController;
  let service: SujetoService;

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

  const mockService = {
    create: jest.fn(),
    findByCuit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SujetoController],
      providers: [
        {
          provide: SujetoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SujetoController>(SujetoController);
    service = module.get<SujetoService>(SujetoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new sujeto successfully', async () => {
      mockService.create.mockResolvedValue(mockSujeto);

      const result = await controller.create(mockCreateDto);

      expect(result).toEqual(mockSujeto);
      expect(mockService.create).toHaveBeenCalledWith(mockCreateDto);
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException with UNPROCESSABLE_ENTITY status when sujeto already exists', async () => {
      const error = new Error('Sujeto con ese CUIT ya existe');
      mockService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.create(mockCreateDto)).rejects.toThrow(
        'Sujeto con ese CUIT ya existe',
      );

      try {
        await controller.create(mockCreateDto);
      } catch (err: any) {
        expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });

    it('should handle service errors correctly', async () => {
      const error = new Error('Internal server error');
      mockService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateDto)).rejects.toThrow(
        HttpException,
      );

      try {
        await controller.create(mockCreateDto);
      } catch (err: any) {
        expect(err.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(err.message).toBe('Internal server error');
      }
    });
  });

  describe('getByCuit', () => {
    it('should return sujeto when found by CUIT', async () => {
      mockService.findByCuit.mockResolvedValue(mockSujeto);

      const result = await controller.getByCuit('20436072180');

      expect(result).toEqual(mockSujeto);
      expect(mockService.findByCuit).toHaveBeenCalledWith('20436072180');
      expect(mockService.findByCuit).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException with NOT_FOUND status when sujeto does not exist', async () => {
      mockService.findByCuit.mockResolvedValue(null);

      await expect(controller.getByCuit('99999999999')).rejects.toThrow(
        HttpException,
      );
      await expect(controller.getByCuit('99999999999')).rejects.toThrow(
        'No existe sujeto con ese CUIT',
      );

      try {
        await controller.getByCuit('99999999999');
      } catch (err: any) {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should call service with correct CUIT parameter', async () => {
      const cuit = '20436072180';
      mockService.findByCuit.mockResolvedValue(mockSujeto);

      await controller.getByCuit(cuit);

      expect(mockService.findByCuit).toHaveBeenCalledWith(cuit);
    });
  });
});
