import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Case,
  CaseResult,
  CaseCategory,
  Judge,
  Lawyer,
} from './entity/cases.entity';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, CaseCategory, CaseResult, Lawyer, Judge]),
  ],
  providers: [CasesService],
  controllers: [CasesController],
})
export class CasesModule {}
