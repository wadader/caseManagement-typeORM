import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Lawyer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

@Entity()
export class Judge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

@Entity()
export class CaseCategory {
  @PrimaryColumn()
  type: string;
}

@Entity()
export class CaseResult {
  @PrimaryColumn()
  result: string;
}

@Entity()
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @ManyToOne(() => CaseCategory)
  @JoinColumn()
  caseType: CaseCategory;

  @ManyToOne(() => CaseResult, { nullable: true })
  @JoinColumn()
  caseResult: CaseResult;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.id)
  prosecutor: Lawyer;

  @ManyToOne(() => Lawyer, (lawyer) => lawyer.id)
  defender: Lawyer;

  @ManyToOne(() => Judge, (judge) => judge.id)
  judge: Judge;
}
