import { IsIn, IsInt, IsString } from 'class-validator';
import { CASE_CATEGORIES, CaseCategoryType } from '../case.types';

export class CreateCaseDto {
  @IsIn(CASE_CATEGORIES)
  caseCategory: CaseCategoryType;

  @IsString()
  description: string;

  @IsInt()
  prosecutorId: number;

  @IsInt()
  defenderId: number;

  @IsInt()
  judgeId: number;
}

export class CreateJudgeDto {
  @IsString()
  name: string;
}

export class CreateLawyerDto {
  @IsString()
  name: string;
}
