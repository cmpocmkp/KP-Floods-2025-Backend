import { DataSource } from 'typeorm';
import { AffectedDistrictCoordinates } from '../floods/entities/affected-district-coordinates.entity';
import { AgricultureImpacts } from '../floods/entities/agriculture-impacts.entity';
import { CnwAssets } from '../floods/entities/cnw-assets.entity';
import { EnergyPowerAssets } from '../floods/entities/energy-power-assets.entity';
import { EsedSchoolDamages } from '../floods/entities/esed-school-damages.entity';
import { HousingImpacts } from '../floods/entities/housing-impacts.entity';
import { HumanLosses } from '../floods/entities/human-losses.entity';
import { IrrigationAssets } from '../floods/entities/irrigation-assets.entity';
import { LivestockLosses } from '../floods/entities/livestock-losses.entity';
import { LocalGovernmentAssets } from '../floods/entities/local-government-assets.entity';
import { PheAssets } from '../floods/entities/phe-assets.entity';
import * as seedData from './seed_all_supreme.json';

// Database configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'caboose.proxy.rlwy.net',
  port: 58300,
  username: 'postgres',
  password: 'ISeAzMTIPpPFwLipzpXtdeJbdGKQBJCI',
  database: 'railway',
  entities: [
    AffectedDistrictCoordinates,
    AgricultureImpacts,
    CnwAssets,
    EnergyPowerAssets,
    EsedSchoolDamages,
    HousingImpacts,
    HumanLosses,
    IrrigationAssets,
    LivestockLosses,
    LocalGovernmentAssets,
    PheAssets,
  ],
  synchronize: false,
});

async function seedDatabase() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log('Database connection initialized');

    // Seed Affected District Coordinates
    console.log('Seeding Affected District Coordinates...');
    const affectedDistrictRepo = AppDataSource.getRepository(AffectedDistrictCoordinates);
    await affectedDistrictRepo.save(seedData.affected_district_coordinates);

    // Seed Agriculture Impacts
    console.log('Seeding Agriculture Impacts...');
    const agricultureRepo = AppDataSource.getRepository(AgricultureImpacts);
    await agricultureRepo.save(seedData.agriculture_impacts);

    // Seed CNW Assets
    console.log('Seeding CNW Assets...');
    const cnwRepo = AppDataSource.getRepository(CnwAssets);
    await cnwRepo.save(seedData.cnw_assets.map(asset => ({
      ...asset,
      road_damage_report: asset.road_damage_report?.toString(),
      bridges_damage_reported: asset.bridges_damage_reported?.toString(),
      culverts_damage_reports: asset.culverts_damage_reports?.toString(),
      report_date: new Date(asset.report_date)
    })));

    // Seed Energy Power Assets
    console.log('Seeding Energy Power Assets...');
    const energyRepo = AppDataSource.getRepository(EnergyPowerAssets);
    await energyRepo.save(seedData.energy_power_assets);

    // Seed ESED School Damages
    console.log('Seeding ESED School Damages...');
    const esedRepo = AppDataSource.getRepository(EsedSchoolDamages);
    await esedRepo.save(seedData.esed_school_damages);

    // Seed Housing Impacts
    console.log('Seeding Housing Impacts...');
    const housingRepo = AppDataSource.getRepository(HousingImpacts);
    await housingRepo.save(seedData.housing_impacts);

    // Seed Human Losses
    console.log('Seeding Human Losses...');
    const humanLossesRepo = AppDataSource.getRepository(HumanLosses);
    await humanLossesRepo.save(seedData.human_losses);

    // Seed Irrigation Assets
    console.log('Seeding Irrigation Assets...');
    const irrigationRepo = AppDataSource.getRepository(IrrigationAssets);
    await irrigationRepo.save(seedData.irrigation_assets);

    // Seed Livestock Losses
    console.log('Seeding Livestock Losses...');
    const livestockRepo = AppDataSource.getRepository(LivestockLosses);
    await livestockRepo.save(seedData.livestock_losses);

    // Seed Local Government Assets
    console.log('Seeding Local Government Assets...');
    const localGovRepo = AppDataSource.getRepository(LocalGovernmentAssets);
    await localGovRepo.save(seedData.local_government_assets);

    // Seed PHE Assets
    console.log('Seeding PHE Assets...');
    const pheRepo = AppDataSource.getRepository(PheAssets);
    await pheRepo.save(seedData.phe_assets);

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the database connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

// Run the seeding process
seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });