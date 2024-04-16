import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { RELATION_NAMES } from './relation_names';

@Entity({ name: RELATION_NAMES.lawyers.tableName })
export class Lawyer {
  @PrimaryGeneratedColumn({ name: RELATION_NAMES.lawyers.fields.id })
  id: number;

  @Column({ name: RELATION_NAMES.lawyers.fields.name })
  name: string;
}

@Entity({ name: RELATION_NAMES.judges.tableName })
export class Judge {
  @PrimaryGeneratedColumn({ name: RELATION_NAMES.judges.fields.id })
  id: number;

  @Column({ name: RELATION_NAMES.judges.fields.name })
  name: string;
}

@Entity({ name: RELATION_NAMES.caseCategories.tableName })
export class CaseCategory {
  @PrimaryColumn({ name: RELATION_NAMES.caseCategories.fields.type })
  type: string;
}

@Entity({ name: RELATION_NAMES.caseResults.tableName })
export class CaseResult {
  @PrimaryColumn({ name: RELATION_NAMES.caseResults.fields.result })
  result: string;
}

@Entity({ name: RELATION_NAMES.cases.tableName })
export class Case {
  @PrimaryGeneratedColumn({ name: RELATION_NAMES.cases.fields.id })
  id: number;

  @Column({ name: RELATION_NAMES.cases.fields.description })
  description: string;

  @ManyToOne(() => CaseCategory)
  @JoinColumn({ name: RELATION_NAMES.cases.fields.caseCategory })
  caseType: CaseCategory;

  @ManyToOne(() => CaseResult, { nullable: true })
  @JoinColumn({ name: RELATION_NAMES.cases.fields.caseResult })
  caseResult: CaseResult;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.id)
  @JoinColumn({ name: RELATION_NAMES.cases.fields.prosecutor })
  prosecutor: Lawyer;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.id)
  @JoinColumn({ name: RELATION_NAMES.cases.fields.defender })
  defender: Lawyer;

  @ManyToOne(() => Judge, (judge) => judge.id)
  @JoinColumn({ name: RELATION_NAMES.cases.fields.judge })
  judge: Judge;
}
