import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomotorService } from './automotor.service';
import { VwAutomotoresConDueno } from '../domain/vw-automotores-con-dueno.entity';
import { ObjetoDeValorEntity } from '../domain/objeto-de-valor.entity';
import { AutomotorEntity } from '../domain/automotor.entity';
import { VinculoSujetoObjetoEntity } from '../domain/vinculo-sujeto-objeto.entity';
import { SujetoService } from 'src/sujeto/application/sujeto.service';
import { SujetoEntity } from 'src/sujeto/domain/sujeto.entity';
import { AutomotorCreateDto } from './dto/automotor.create.dto';
import { AutomotorUpdateDto } from './dto/automotor.update.dto';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('AutomotorService', () => {
  let service: AutomotorService;
  let viewRepository: Repository<VwAutomotoresConDueno>;
  let objetoDeValorRepository: Repository<ObjetoDeValorEntity>;
  let automotorRepository: Repository<AutomotorEntity>;
  let vinculoSORepository: Repository<VinculoSujetoObjetoEntity>;
  let sujetoService: SujetoService;

  const mockSujeto: SujetoEntity = {
    id: '1',
    cuit: '20304050607',
    denominacion: 'Juan Pérez SRL',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockObjetoDeValor: ObjetoDeValorEntity = {
    id: '1',
    tipo: 'AUTOMOTOR',
    codigo: 'ABC123',
    descripcion: 'Automotor ABC123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAutomotor: AutomotorEntity = {
    id: '1',
    objetoDeValor: mockObjetoDeValor,
    dominio: 'ABC123',
    numeroChasis: '9BWZZZ377VT004251',
    numeroMotor: 'MTR-456789',
    color: 'Rojo',
    fechaFabricacion: 202307,
    fechaAltaRegistro: new Date(),
  };

  const mockVwAutomotor: VwAutomotoresConDueno = {
    dominio: 'ABC123',
    numeroChasis: '9BWZZZ377VT004251',
    numeroMotor: 'MTR-456789',
    color: 'Rojo',
    fechaFabricacion: 202307,
    cuitDueno: '20304050607',
    denominacionDueno: 'Juan Pérez SRL',
  };

  const mockVinculoSO: VinculoSujetoObjetoEntity = {
    id: '1',
    objetoDeValor: mockObjetoDeValor,
    sujeto: mockSujeto,
    tipoVinculo: 'DUENO',
    porcentaje: 100,
    responsable: 'S',
    fechaInicio: new Date(),
    createdAt: new Date(),
  };

  const mockCreateDto: AutomotorCreateDto = {
    dominio: 'ABC123',
    numeroChasis: '9BWZZZ377VT004251',
    numeroMotor: 'MTR-456789',
    color: 'Rojo',
    fechaFabricacion: 202307,
    cuitDuenio: '20304050607',
  };

  const mockUpdateDto: AutomotorUpdateDto = {
    dominio: 'ABC123',
    numeroChasis: '9BWZZZ377VT004252',
    numeroMotor: 'MTR-456790',
    color: 'Azul',
    fechaFabricacion: 202308,
    cuitDuenio: '20304050607',
  };

  const mockViewRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockObjetoDeValorRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockAutomotorRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockVinculoSORepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockSujetoService = {
    findByCuit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomotorService,
        {
          provide: getRepositoryToken(VwAutomotoresConDueno),
          useValue: mockViewRepository,
        },
        {
          provide: getRepositoryToken(ObjetoDeValorEntity),
          useValue: mockObjetoDeValorRepository,
        },
        {
          provide: getRepositoryToken(AutomotorEntity),
          useValue: mockAutomotorRepository,
        },
        {
          provide: getRepositoryToken(VinculoSujetoObjetoEntity),
          useValue: mockVinculoSORepository,
        },
        {
          provide: SujetoService,
          useValue: mockSujetoService,
        },
      ],
    }).compile();

    service = module.get<AutomotorService>(AutomotorService);
    viewRepository = module.get<Repository<VwAutomotoresConDueno>>(
      getRepositoryToken(VwAutomotoresConDueno),
    );
    objetoDeValorRepository = module.get<Repository<ObjetoDeValorEntity>>(
      getRepositoryToken(ObjetoDeValorEntity),
    );
    automotorRepository = module.get<Repository<AutomotorEntity>>(
      getRepositoryToken(AutomotorEntity),
    );
    vinculoSORepository = module.get<Repository<VinculoSujetoObjetoEntity>>(
      getRepositoryToken(VinculoSujetoObjetoEntity),
    );
    sujetoService = module.get<SujetoService>(SujetoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findView', () => {
    it('should return an array of automotores from view', async () => {
      const mockList = [mockVwAutomotor];
      mockViewRepository.find.mockResolvedValue(mockList);

      const result = await service.findView();

      expect(result).toEqual(mockList);
      expect(mockViewRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no automotores exist', async () => {
      mockViewRepository.find.mockResolvedValue([]);

      const result = await service.findView();

      expect(result).toEqual([]);
      expect(mockViewRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByDominio', () => {
    it('should return an automotor by dominio', async () => {
      mockViewRepository.findOne.mockResolvedValue(mockVwAutomotor);

      const result = await service.findByDominio('ABC123');

      expect(result).toEqual({
        dominio: 'ABC123',
        numeroChasis: '9BWZZZ377VT004251',
        numeroMotor: 'MTR-456789',
        color: 'Rojo',
        fechaFabricacion: 202307,
        cuitDueno: '20304050607',
        denominacionDueno: 'Juan Pérez SRL',
      });
      expect(mockViewRepository.findOne).toHaveBeenCalledWith({
        where: { dominio: 'ABC123' },
      });
    });

    it('should throw NotFoundException when automotor does not exist', async () => {
      mockViewRepository.findOne.mockResolvedValue(null);

      await expect(service.findByDominio('INVALID')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByDominio('INVALID')).rejects.toThrow(
        'Automotor no encontrado',
      );
    });
  });

  describe('create', () => {
    it('should create a new automotor successfully', async () => {
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);
      mockObjetoDeValorRepository.findOne.mockResolvedValue(null);
      mockObjetoDeValorRepository.create.mockReturnValue(mockObjetoDeValor);
      mockObjetoDeValorRepository.save.mockResolvedValue(mockObjetoDeValor);
      mockAutomotorRepository.findOne.mockResolvedValue(null);
      mockAutomotorRepository.create.mockReturnValue(mockAutomotor);
      mockAutomotorRepository.save.mockResolvedValue(mockAutomotor);
      mockVinculoSORepository.findOne.mockResolvedValue(null);
      mockVinculoSORepository.create.mockReturnValue(mockVinculoSO);
      mockVinculoSORepository.save.mockResolvedValue(mockVinculoSO);

      const result = await service.create(mockCreateDto);

      expect(result).toEqual({
        ...mockAutomotor,
        cuitDueno: mockSujeto.cuit,
        denominacionDueno: mockSujeto.denominacion,
      });
      expect(mockSujetoService.findByCuit).toHaveBeenCalledWith(
        '20304050607',
      );
      expect(mockObjetoDeValorRepository.findOne).toHaveBeenCalled();
      expect(mockAutomotorRepository.save).toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException when sujeto does not exist', async () => {
      mockSujetoService.findByCuit.mockResolvedValue(null);

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.create(mockCreateDto)).rejects.toThrow(
        'No existe sujeto con ese CUIT',
      );
    });

    it('should use existing objetoDeValor if it exists', async () => {
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);
      mockObjetoDeValorRepository.findOne.mockResolvedValue(mockObjetoDeValor);
      mockAutomotorRepository.findOne.mockResolvedValue(null);
      mockAutomotorRepository.create.mockReturnValue(mockAutomotor);
      mockAutomotorRepository.save.mockResolvedValue(mockAutomotor);
      mockVinculoSORepository.findOne.mockResolvedValue(null);
      mockVinculoSORepository.create.mockReturnValue(mockVinculoSO);
      mockVinculoSORepository.save.mockResolvedValue(mockVinculoSO);

      await service.create(mockCreateDto);

      expect(mockObjetoDeValorRepository.create).not.toHaveBeenCalled();
      expect(mockObjetoDeValorRepository.save).not.toHaveBeenCalled();
    });

    it('should update existing automotor if it exists', async () => {
      const existingAutomotor = { ...mockAutomotor };
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);
      mockObjetoDeValorRepository.findOne.mockResolvedValue(mockObjetoDeValor);
      mockAutomotorRepository.findOne.mockResolvedValue(existingAutomotor);
      mockAutomotorRepository.save.mockResolvedValue(existingAutomotor);
      mockVinculoSORepository.findOne.mockResolvedValue(null);
      mockVinculoSORepository.create.mockReturnValue(mockVinculoSO);
      mockVinculoSORepository.save.mockResolvedValue(mockVinculoSO);

      await service.create(mockCreateDto);

      expect(mockAutomotorRepository.create).not.toHaveBeenCalled();
      expect(mockAutomotorRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          dominio: mockCreateDto.dominio,
          numeroMotor: mockCreateDto.numeroMotor,
          color: mockCreateDto.color,
          fechaFabricacion: mockCreateDto.fechaFabricacion,
        }),
      );
    });

    it('should finalize existing vinculo if it exists', async () => {
      const existingVinculo = { ...mockVinculoSO };
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);
      mockObjetoDeValorRepository.findOne.mockResolvedValue(mockObjetoDeValor);
      mockAutomotorRepository.findOne.mockResolvedValue(null);
      mockAutomotorRepository.create.mockReturnValue(mockAutomotor);
      mockAutomotorRepository.save.mockResolvedValue(mockAutomotor);
      mockVinculoSORepository.findOne.mockResolvedValue(existingVinculo);
      mockVinculoSORepository.save.mockResolvedValue({
        ...existingVinculo,
        fechaFin: expect.any(Date),
      });
      mockVinculoSORepository.create.mockReturnValue(mockVinculoSO);
      mockVinculoSORepository.save.mockResolvedValue(mockVinculoSO);

      await service.create(mockCreateDto);

      expect(mockVinculoSORepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingVinculo,
          fechaFin: expect.any(Date),
        }),
      );
    });
  });

  describe('update', () => {
    it('should update an existing automotor successfully', async () => {
      const updatedAutomotor = { ...mockAutomotor, color: 'Azul' };
      mockAutomotorRepository.findOne
        .mockResolvedValueOnce(mockAutomotor) // Primera llamada para encontrar el automotor
        .mockResolvedValueOnce(null); // Segunda llamada para verificar dominio duplicado
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);
      mockVinculoSORepository.findOne.mockResolvedValue({
        ...mockVinculoSO,
        sujeto: mockSujeto,
      });
      mockAutomotorRepository.save.mockResolvedValue(updatedAutomotor);

      const result = await service.update('ABC123', mockUpdateDto);

      expect(result).toEqual({
        ...updatedAutomotor,
        cuitDueno: mockSujeto.cuit,
        denominacionDueno: mockSujeto.denominacion,
      });
      expect(mockAutomotorRepository.findOne).toHaveBeenCalledWith({
        where: { dominio: 'ABC123' },
        relations: ['objetoDeValor'],
      });
      expect(mockAutomotorRepository.save).toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException when automotor does not exist', async () => {
      mockAutomotorRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('INVALID', mockUpdateDto),
      ).rejects.toThrow(UnprocessableEntityException);
      await expect(
        service.update('INVALID', mockUpdateDto),
      ).rejects.toThrow('No existe este vehículo');
    });

    it('should throw UnprocessableEntityException when sujeto does not exist', async () => {
      mockAutomotorRepository.findOne.mockResolvedValue(mockAutomotor);
      mockSujetoService.findByCuit.mockResolvedValue(null);

      await expect(
        service.update('ABC123', mockUpdateDto),
      ).rejects.toThrow(UnprocessableEntityException);
      await expect(
        service.update('ABC123', mockUpdateDto),
      ).rejects.toThrow('Este sujeto no existe');
    });

    it('should throw UnprocessableEntityException when new dominio already exists', async () => {
      const existingAutomotorWithNewDominio = { ...mockAutomotor, dominio: 'XYZ789' };
      mockAutomotorRepository.findOne
        .mockResolvedValueOnce(mockAutomotor)
        .mockResolvedValueOnce(existingAutomotorWithNewDominio);
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);

      const updateDtoWithNewDominio = { ...mockUpdateDto, dominio: 'XYZ789' };

      await expect(
        service.update('ABC123', updateDtoWithNewDominio),
      ).rejects.toThrow(UnprocessableEntityException);
      await expect(
        service.update('ABC123', updateDtoWithNewDominio),
      ).rejects.toThrow('El dominio elegido ya existe en otro automóvil');
    });

    it('should change owner when cuitDuenio is different', async () => {
      const differentSujeto = { ...mockSujeto, cuit: '99999999999', id: '2' };
      const vinculoWithDifferentOwner = {
        ...mockVinculoSO,
        sujeto: mockSujeto,
      };
      mockAutomotorRepository.findOne.mockResolvedValue(mockAutomotor);
      mockSujetoService.findByCuit.mockResolvedValue(differentSujeto);
      mockVinculoSORepository.findOne.mockResolvedValue(vinculoWithDifferentOwner);
      mockVinculoSORepository.save.mockResolvedValue({
        ...vinculoWithDifferentOwner,
        fechaFin: new Date(),
      });
      mockVinculoSORepository.create.mockReturnValue({
        ...mockVinculoSO,
        sujeto: differentSujeto,
      });
      mockVinculoSORepository.save.mockResolvedValue({
        ...mockVinculoSO,
        sujeto: differentSujeto,
      });
      mockAutomotorRepository.save.mockResolvedValue(mockAutomotor);

      const updateDtoWithDifferentOwner = {
        ...mockUpdateDto,
        cuitDuenio: '99999999999',
      };

      await service.update('ABC123', updateDtoWithDifferentOwner);

      expect(mockVinculoSORepository.save).toHaveBeenCalledTimes(2);
      expect(mockVinculoSORepository.create).toHaveBeenCalled();
    });

    it('should not change owner when cuitDuenio is the same', async () => {
      mockAutomotorRepository.findOne.mockResolvedValue(mockAutomotor);
      mockSujetoService.findByCuit.mockResolvedValue(mockSujeto);
      mockVinculoSORepository.findOne.mockResolvedValue({
        ...mockVinculoSO,
        sujeto: mockSujeto,
      });
      mockAutomotorRepository.save.mockResolvedValue(mockAutomotor);

      await service.update('ABC123', mockUpdateDto);

      expect(mockVinculoSORepository.save).not.toHaveBeenCalled();
      expect(mockVinculoSORepository.create).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an automotor successfully', async () => {
      mockAutomotorRepository.findOne.mockResolvedValue(mockAutomotor);
      mockVinculoSORepository.delete.mockResolvedValue({ affected: 1 });
      mockAutomotorRepository.delete.mockResolvedValue({ affected: 1 });
      mockObjetoDeValorRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('ABC123');

      expect(result).toEqual({
        message: 'Automotor ABC123 eliminado correctamente',
      });
      expect(mockAutomotorRepository.findOne).toHaveBeenCalledWith({
        where: { dominio: 'ABC123' },
        relations: ['objetoDeValor'],
      });
      expect(mockVinculoSORepository.delete).toHaveBeenCalledWith({
        objetoDeValor: { id: mockObjetoDeValor.id },
      });
      expect(mockAutomotorRepository.delete).toHaveBeenCalledWith({
        id: mockAutomotor.id,
      });
      expect(mockObjetoDeValorRepository.delete).toHaveBeenCalledWith({
        id: mockObjetoDeValor.id,
      });
    });

    it('should throw UnprocessableEntityException when automotor does not exist', async () => {
      mockAutomotorRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('INVALID')).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.delete('INVALID')).rejects.toThrow(
        'Dominio no encontrado',
      );
    });
  });
});
