import 'dotenv/config';
import { AppDataSource } from './data-source';
import { SujetoEntity } from '../sujeto/domain/sujeto.entity';
import { ObjetoDeValorEntity } from '../automotor/domain/objeto-de-valor.entity';
import { AutomotorEntity } from '../automotor/domain/automotor.entity';
import { VinculoSujetoObjetoEntity } from '../automotor/domain/vinculo-sujeto-objeto.entity';

async function seed() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('Database connected');

    const sujetoRepo = AppDataSource.getRepository(SujetoEntity);
    const objetoDeValorRepo = AppDataSource.getRepository(ObjetoDeValorEntity);
    const automotorRepo = AppDataSource.getRepository(AutomotorEntity);
    const vinculoRepo = AppDataSource.getRepository(VinculoSujetoObjetoEntity);

    // Limpiar datos existentes (opcional, comentar si no quieres borrar)
    console.log('Cleaning existing data...');
    await AppDataSource.query('DELETE FROM "Vinculo_Sujeto_Objeto"');
    await AppDataSource.query('DELETE FROM "Automotores"');
    await AppDataSource.query('DELETE FROM "Objeto_De_Valor"');
    await AppDataSource.query('DELETE FROM "Sujeto"');

    // Crear Sujetos
    console.log('Creating sujetos...');
    const sujeto1 = sujetoRepo.create({
      cuit: '20436072180',
      denominacion: 'Giovanni Decicco Ominetti',
    });
    
    const sujetoGuardado = await sujetoRepo.save(sujeto1);
    console.log(`Created sujeto: ${sujetoGuardado.denominacion}`);

    // Crear Objetos de Valor y Automotores
    console.log('Creating automotores...');
    const automotoresData = [
      {
        dominio: 'ABC123',
        numeroChasis: '9BWZZZ377VT004251',
        numeroMotor: 'MTR-456789',
        color: 'Rojo',
        fechaFabricacion: 202301,
        sujeto: sujetoGuardado,
      },
      {
        dominio: 'XYZ789',
        numeroChasis: '9BWZZZ377VT004252',
        numeroMotor: 'MTR-456790',
        color: 'Azul',
        fechaFabricacion: 202302,
        sujeto: sujetoGuardado,
      },
      {
        dominio: 'AB123CD',
        numeroChasis: '9BWZZZ377VT004253',
        numeroMotor: 'MTR-456791',
        color: 'Blanco',
        fechaFabricacion: 202303,
        sujeto: sujetoGuardado,
      },
      {
        dominio: 'DEF456',
        numeroChasis: '9BWZZZ377VT004254',
        numeroMotor: 'MTR-456792',
        color: 'Negro',
        fechaFabricacion: 202304,
        sujeto: sujetoGuardado,
      },
    ];

    for (const autoData of automotoresData) {
      // Crear Objeto de Valor
      let objetoDeValor = await objetoDeValorRepo.findOne({
        where: { codigo: autoData.dominio, tipo: 'AUTOMOTOR' },
      });

      if (!objetoDeValor) {
        objetoDeValor = objetoDeValorRepo.create({
          tipo: 'AUTOMOTOR',
          codigo: autoData.dominio,
          descripcion: `Automotor ${autoData.dominio}`,
        });
        objetoDeValor = await objetoDeValorRepo.save(objetoDeValor);
      }

      // Crear Automotor
      let automotor = await automotorRepo.findOne({
        where: { dominio: autoData.dominio },
      });

      if (!automotor) {
        automotor = automotorRepo.create({
          objetoDeValor,
          dominio: autoData.dominio,
          numeroChasis: autoData.numeroChasis,
          numeroMotor: autoData.numeroMotor,
          color: autoData.color,
          fechaFabricacion: autoData.fechaFabricacion,
        });
        automotor = await automotorRepo.save(automotor);

        // Crear Vínculo
        const vinculo = vinculoRepo.create({
          objetoDeValor,
          sujeto: autoData.sujeto,
          tipoVinculo: 'DUENO',
          porcentaje: 100,
          responsable: 'S',
          fechaInicio: new Date(),
        });
        await vinculoRepo.save(vinculo);
      }
    }

    console.log(`Created ${automotoresData.length} automotores`);
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
