import { Injectable } from '@nestjs/common';
import {
  CreateCaseDto,
  CreateJudgeDto,
  CreateLawyerDto,
} from './Dtos/createDto';
import { CaseResultType } from './entity/case.types';

@Injectable()
export abstract class CasesService {
  abstract cases: Cases;
  abstract judges: Judges;
  abstract lawyers: Lawyers;

  protected abstract initCaseCategories(): Promise<void>;

  protected abstract initCaseResults(): Promise<void>;
}

interface Cases {
  findAll(): Promise<any>;
  findOneById(id: number): Promise<any>;
  create(createCaseDto: CreateCaseDto): Promise<number>;
  resolve(id: number, resolution: CaseResultType): Promise<void>;
  findAllJudgedBy(judgeId: number): Promise<any>;
  findAllWithLawyer(lawyerId: number): Promise<any>;
}

interface Judges {
  create({ name }: CreateJudgeDto): Promise<number>;
  findAll(): Promise<any>;
}

interface Lawyers {
  create(x: CreateLawyerDto): Promise<number>;
  findAll(): Promise<any>;
}
