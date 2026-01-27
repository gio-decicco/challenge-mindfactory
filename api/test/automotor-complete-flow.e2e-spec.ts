import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { SujetoEntity } from '../src/sujeto/domain/sujeto.entity';
import { AutomotorEntity } from '../src/automotor/domain/automotor.entity';
import { ObjetoDeValorEntity } from '../src/automotor/domain/objeto-de-valor.entity';
import { VinculoSujetoObjetoEntity } from '../src/automotor/domain/vinculo-sujeto-objeto.entity';

describe('Automotor Complete Flow (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let createdSujetoId: string;
  let createdAutomotorDominio: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (dataSource && dataSource.isInitialized) {
      if (createdAutomotorDominio) {
        // Eliminar automotor y sus relaciones
        const automotorRepo = dataSource.getRepository(AutomotorEntity);
        const automotor = await automotorRepo.findOne({
          where: { dominio: createdAutomotorDominio },
          relations: ['objetoDeValor'],
        });

        if (automotor) {
          const vinculoRepo = dataSource.getRepository(VinculoSujetoObjetoEntity);
          await vinculoRepo.delete({
            objetoDeValor: { id: automotor.objetoDeValor.id },
          });

          const objetoDeValorRepo = dataSource.getRepository(ObjetoDeValorEntity);
          await automotorRepo.delete({ id: automotor.id });
          await objetoDeValorRepo.delete({ id: automotor.objetoDeValor.id });
        }
      }

      // Note: We don't delete the sujeto if it has vínculos (foreign key constraint)
      // The sujeto may be used by other automotores, so we leave it
    }

    await app.close();
  });

  describe('Complete flow: Create Sujeto -> Create Automotor -> Get -> Update -> Delete', () => {
    it('should complete the full flow successfully', async () => {
      // Generate unique identifiers to avoid conflicts
      const timestamp = Date.now();
      // Use a valid CUIT format: 20-43607218-0 (known valid CUIT)
      const baseCuit = '20436072180'; // Known valid CUIT
      const sujetoCuit = baseCuit; // Use known valid CUIT, handle duplicates
      const sujetoDenominacion = `Test E2E Sujeto ${timestamp}`;
      // Generate valid dominio format: ABC123 (3 letters + 3 numbers)
      const uniqueNum = String(timestamp).slice(-3);
      // Valid format: 3 letters + 3 numbers (e.g., ABC123)
      const automotorDominio = `EEE${uniqueNum}`; // Format: EEE123 (3 letters + 3 numbers = valid)
      const automotorColor = 'Rojo';
      const updatedColor = 'Azul';

      // Step 1: Create Sujeto (may fail if exists, that's OK)
      let createSujetoResponse = await request(app.getHttpServer())
        .post('/sujetos')
        .send({
          cuit: sujetoCuit,
          denominacion: sujetoDenominacion,
        });

      // If subject already exists (422), try to get it instead
      if (createSujetoResponse.status === 422) {
        const getSujetoResponse = await request(app.getHttpServer())
          .get(`/sujetos/by-cuit?cuit=${sujetoCuit}`)
          .expect(200);
        createSujetoResponse = { body: getSujetoResponse.body, status: 200 } as any;
      } else {
        expect(createSujetoResponse.status).toBe(201);
      }

      expect(createSujetoResponse.body).toHaveProperty('id');
      expect(createSujetoResponse.body.cuit).toBe(sujetoCuit);
      createdSujetoId = createSujetoResponse.body.id;

      // Step 2: Get Sujeto by CUIT
      const getSujetoResponse = await request(app.getHttpServer())
        .get(`/sujetos/by-cuit?cuit=${sujetoCuit}`)
        .expect(200);

      expect(getSujetoResponse.body.cuit).toBe(sujetoCuit);
      // Note: denominacion may differ if sujeto already existed

      // Step 3: Create Automotor with the created Sujeto as owner
      const now = new Date();
      const currentDate = now.getFullYear() * 100 + (now.getMonth() + 1);

      const createAutomotorResponse = await request(app.getHttpServer())
        .post('/automotores')
        .send({
          dominio: automotorDominio,
          numeroChasis: 'E2E-CHASSIS-123',
          numeroMotor: 'E2E-MOTOR-456',
          color: automotorColor,
          fechaFabricacion: currentDate,
          cuitDuenio: sujetoCuit,
        })
        .expect(201);

      expect(createAutomotorResponse.body).toHaveProperty('dominio', automotorDominio);
      expect(createAutomotorResponse.body.color).toBe(automotorColor);
      expect(createAutomotorResponse.body.cuitDueno).toBe(sujetoCuit);
      // Note: denominacionDueno may differ if sujeto already existed with different name
      expect(createAutomotorResponse.body.denominacionDueno).toBeDefined();
      createdAutomotorDominio = automotorDominio;

      // Step 4: Get Automotor by dominio
      const getAutomotorResponse = await request(app.getHttpServer())
        .get(`/automotores/${automotorDominio}`)
        .expect(200);

      expect(getAutomotorResponse.body.dominio).toBe(automotorDominio);
      expect(getAutomotorResponse.body.color).toBe(automotorColor);
      expect(getAutomotorResponse.body.cuitDueno).toBe(sujetoCuit);

      // Step 5: Get all Automotores (should include the created one)
      const getAllAutomotoresResponse = await request(app.getHttpServer())
        .get('/automotores')
        .expect(200);

      expect(Array.isArray(getAllAutomotoresResponse.body)).toBe(true);
      const foundAutomotor = getAllAutomotoresResponse.body.find(
        (a: any) => a.dominio === automotorDominio,
      );
      expect(foundAutomotor).toBeDefined();

      // Step 6: Update Automotor
      const updateAutomotorResponse = await request(app.getHttpServer())
        .put(`/automotores/${automotorDominio}`)
        .send({
          dominio: automotorDominio,
          numeroChasis: 'E2E-CHASSIS-UPDATED',
          numeroMotor: 'E2E-MOTOR-UPDATED',
          color: updatedColor,
          fechaFabricacion: currentDate,
          cuitDuenio: sujetoCuit,
        })
        .expect(201);

      expect(updateAutomotorResponse.body.dominio).toBe(automotorDominio);
      expect(updateAutomotorResponse.body.color).toBe(updatedColor);
      expect(updateAutomotorResponse.body.numeroChasis).toBe('E2E-CHASSIS-UPDATED');

      // Step 7: Verify update by getting the automotor again
      const getUpdatedAutomotorResponse = await request(app.getHttpServer())
        .get(`/automotores/${automotorDominio}`)
        .expect(200);

      expect(getUpdatedAutomotorResponse.body.color).toBe(updatedColor);
      expect(getUpdatedAutomotorResponse.body.numeroChasis).toBe('E2E-CHASSIS-UPDATED');

      // Step 8: Delete Automotor
      await request(app.getHttpServer())
        .delete(`/automotores/${automotorDominio}`)
        .expect(204);

      // Step 9: Verify deletion - should return 404
      await request(app.getHttpServer())
        .get(`/automotores/${automotorDominio}`)
        .expect(404);

      // Clean up
      createdAutomotorDominio = '';
    });
  });

  describe('Error scenarios in the flow', () => {
    it('should handle invalid CUIT format when creating sujeto', async () => {
      // Note: The DTO validation happens at class-validator level
      // If it passes validation but CUIT is invalid, it will be caught by the constructor
      const response = await request(app.getHttpServer())
        .post('/sujetos')
        .send({
          cuit: '1234567890', // Invalid CUIT (less than 11 digits)
          denominacion: 'Test',
        });
      
      // Could be 400 (validation) or 422 (business logic)
      expect([400, 422]).toContain(response.status);
    });

    it('should handle invalid dominio when creating automotor', async () => {
      await request(app.getHttpServer())
        .post('/automotores')
        .send({
          dominio: 'INVALID', // Invalid dominio format
          color: 'Rojo',
          fechaFabricacion: 202307,
          cuitDuenio: '20436072180',
        })
        .expect(400);
    });

    it('should handle non-existent sujeto when creating automotor', async () => {
      const now = new Date();
      const currentDate = now.getFullYear() * 100 + (now.getMonth() + 1);
      
      // Generate a valid CUIT format that doesn't exist
      const timestamp = Date.now();
      const nonExistentCuit = `27${String(timestamp).slice(-9)}9`;

      const response = await request(app.getHttpServer())
        .post('/automotores')
        .send({
          dominio: 'TEST999',
          color: 'Rojo',
          fechaFabricacion: currentDate,
          cuitDuenio: nonExistentCuit, // Valid format but non-existent CUIT
        });
      
      // Should be 422 (Unprocessable Entity) when sujeto doesn't exist
      // or 400 if CUIT validation fails first
      expect([400, 422]).toContain(response.status);
    });
  });
});
