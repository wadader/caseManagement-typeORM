import { DynamicModule, Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Case,
  CaseResult,
  CaseCategory,
  Judge,
  Lawyer,
} from './entity/cases_typeorm.entity';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { TypeOrmCasesService } from './providers/cases_typeorm_provider';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import * as drizzleSchema from './entity/cases_drizzleorm.schema';
import { DrizzleOrmCasesService } from './providers/cases_drizzleorm_provider';

const casesProvider: SelectedProviders = {
  typeOrm: {
    importedModules: TypeOrmModule.forFeature([
      Case,
      CaseCategory,
      CaseResult,
      Lawyer,
      Judge,
    ]),
    serviceProvider: TypeOrmCasesService,
    db: TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.POSTGRES_URL,
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  },
  drizzleOrm: {
    db: DrizzlePGModule.registerAsync({
      tag: 'DB_DEV',
      useFactory() {
        return {
          pg: {
            connection: 'client',
            config: { connectionString: process.env.POSTGRES_URL },
          },
          config: { schema: drizzleSchema },
        };
      },
    }),
    serviceProvider: DrizzleOrmCasesService,
  },
} as const;

export const selectedProvider = casesProvider.drizzleOrm;

@Module({
  ...(selectedProvider.importedModules && {
    imports: [selectedProvider.importedModules],
  }),
  providers: [
    { provide: CasesService, useClass: selectedProvider.serviceProvider },
  ],
  controllers: [CasesController],
})
export class CasesModule {}

interface SelectedProviders {
  typeOrm: SelectedProvider;
  drizzleOrm: SelectedProvider;
}

interface SelectedProvider {
  serviceProvider: Type<CasesService>;
  importedModules?: DynamicModule;
  db: DynamicModule;
}
