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

const typeOrmImport = TypeOrmModule.forFeature([
  Case,
  CaseCategory,
  CaseResult,
  Lawyer,
  Judge,
]);

const casesProvider: SelectedProviders = {
  typeOrm: {
    importedModules: typeOrmImport,
    serviceProvider: TypeOrmCasesService,
  },
} as const;

export const selectedProvider = casesProvider.typeOrm;

@Module({
  imports: [selectedProvider.importedModules],
  providers: [
    { provide: CasesService, useClass: selectedProvider.serviceProvider },
  ],
  controllers: [CasesController],
})
export class CasesModule {}

interface SelectedProviders {
  typeOrm: SelectedProvider;
}

interface SelectedProvider {
  serviceProvider: Type<CasesService>;
  importedModules: DynamicModule;
}
