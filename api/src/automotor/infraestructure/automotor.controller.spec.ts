import { Test, TestingModule } from '@nestjs/testing';
import { AutomotorController } from './automotor.controller';
import { AutomotorService } from '../application/automotor.service';
import { AutomotorCreateDto } from '../application/dto/automotor.create.dto';
import { AutomotorUpdateDto } from '../application/dto/automotor.update.dto';
import { AutomotorResponseDto } from '../application/dto/automotor.response.dto';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('AutomotorController', () => {
  let controller: AutomotorController;
  let service: AutomotorService;

  const mockAutomotorResponse: AutomotorResponseDto = {
    dominio: 'ABC123',
    numeroChasis: '9BWZZZ377VT004251',
    numeroMotor: 'MTR-456789',
    color: 'Rojo',
    fechaFabricacion: 202307,
    cuitDueno: '20304050607',
    denominacionDueno: 'Juan Pérez SRL',
  };

  const mockAutomotorList: AutomotorResponseDto[] = [
    mockAutomotorResponse,
    {
      dominio: 'XYZ789',
      numeroChasis: '9BWZZZ377VT004252',
      numeroMotor: 'MTR-456790',
      color: 'Azul',
      fechaFabricacion: 202308,
      cuitDueno: '20304050608',
      denominacionDueno: 'María González SA',
    },
  ];

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
    numeroChasis: '9BWZZZ377VT004251',
    numeroMotor: 'MTR-456789',
    color: 'Azul',
    fechaFabricacion: 202307,
    cuitDuenio: '20304050607',
  };

  const mockService = {
    findView: jest.fn(),
    findByDominio: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutomotorController],
      providers: [
        {
          provide: AutomotorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AutomotorController>(AutomotorController);
    service = module.get<AutomotorService>(AutomotorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of automotores', async () => {
      mockService.findView.mockResolvedValue(mockAutomotorList);

      const result = await controller.findAll();

      expect(result).toEqual(mockAutomotorList);
      expect(mockService.findView).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no automotores exist', async () => {
      mockService.findView.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockService.findView).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByDominio', () => {
    it('should return an automotor by dominio', async () => {
      mockService.findByDominio.mockResolvedValue(mockAutomotorResponse);

      const result = await controller.findByDominio('ABC123');

      expect(result).toEqual(mockAutomotorResponse);
      expect(mockService.findByDominio).toHaveBeenCalledWith('ABC123');
      expect(mockService.findByDominio).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when automotor does not exist', async () => {
      mockService.findByDominio.mockRejectedValue(
        new NotFoundException('Automotor no encontrado'),
      );

      await expect(controller.findByDominio('INVALID')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockService.findByDominio).toHaveBeenCalledWith('INVALID');
    });

    it('should handle service errors correctly', async () => {
      const error = new Error('Internal server error');
      mockService.findByDominio.mockRejectedValue(error);

      await expect(controller.findByDominio('ABC123')).rejects.toThrow(Error);
    });
  });

  describe('create', () => {
    it('should create a new automotor', async () => {
      mockService.create.mockResolvedValue(mockAutomotorResponse);

      const result = await controller.create(mockCreateDto);

      expect(result).toEqual(mockAutomotorResponse);
      expect(mockService.create).toHaveBeenCalledWith(mockCreateDto);
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw UnprocessableEntityException when sujeto does not exist', async () => {
      mockService.create.mockRejectedValue(
        new UnprocessableEntityException('No existe sujeto con ese CUIT'),
      );

      await expect(controller.create(mockCreateDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(mockService.create).toHaveBeenCalledWith(mockCreateDto);
    });

    it('should handle service errors correctly', async () => {
      const error = new Error('Internal server error');
      mockService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateDto)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should update an existing automotor', async () => {
      const updatedResponse = { ...mockAutomotorResponse, color: 'Azul' };
      mockService.update.mockResolvedValue(updatedResponse);

      await controller.update('ABC123', mockUpdateDto);

      expect(mockService.update).toHaveBeenCalledWith('ABC123', mockUpdateDto);
      expect(mockService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw UnprocessableEntityException when automotor does not exist', async () => {
      mockService.update.mockRejectedValue(
        new UnprocessableEntityException('No existe este vehículo'),
      );

      await expect(
        controller.update('INVALID', mockUpdateDto),
      ).rejects.toThrow(UnprocessableEntityException);
      expect(mockService.update).toHaveBeenCalledWith('INVALID', mockUpdateDto);
    });

    it('should throw UnprocessableEntityException when sujeto does not exist', async () => {
      mockService.update.mockRejectedValue(
        new UnprocessableEntityException('Este sujeto no existe'),
      );

      await expect(
        controller.update('ABC123', mockUpdateDto),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should handle service errors correctly', async () => {
      const error = new Error('Internal server error');
      mockService.update.mockRejectedValue(error);

      await expect(
        controller.update('ABC123', mockUpdateDto),
      ).rejects.toThrow(Error);
    });
  });

  describe('delete', () => {
    it('should delete an automotor by dominio', async () => {
      mockService.delete.mockResolvedValue({
        message: 'Automotor ABC123 eliminado correctamente',
      });

      await controller.delete('ABC123');

      expect(mockService.delete).toHaveBeenCalledWith('ABC123');
      expect(mockService.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw UnprocessableEntityException when automotor does not exist', async () => {
      mockService.delete.mockRejectedValue(
        new UnprocessableEntityException('Dominio no encontrado'),
      );

      await expect(controller.delete('INVALID')).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(mockService.delete).toHaveBeenCalledWith('INVALID');
    });

    it('should handle service errors correctly', async () => {
      const error = new Error('Internal server error');
      mockService.delete.mockRejectedValue(error);

      await expect(controller.delete('ABC123')).rejects.toThrow(Error);
    });

    it('should return 204 status code on successful deletion', async () => {
      mockService.delete.mockResolvedValue({
        message: 'Automotor ABC123 eliminado correctamente',
      });

      const result = await controller.delete('ABC123');

      expect(result).toBeUndefined(); // @HttpCode(204) no retorna contenido
      expect(mockService.delete).toHaveBeenCalledWith('ABC123');
    });
  });
});
