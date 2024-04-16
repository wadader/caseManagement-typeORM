import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as drizzleSchema from '../entity/cases_drizzleorm.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CasesService } from '../cases.service';
import { eq, or } from 'drizzle-orm';
import {
  CreateCaseDto,
  CreateJudgeDto,
  CreateLawyerDto,
} from '../Dtos/createDto';
import { CaseResultType } from '../entity/case.types';

const { cases, lawyers, judges } = drizzleSchema;

@Injectable()
export class DrizzleOrmCasesService extends CasesService {
  constructor(
    @Inject('DB_DEV') private drizzleDev: NodePgDatabase<typeof drizzleSchema>,
  ) {
    super();
  }

  cases = {
    findAll: async () => {
      return this.drizzleDev.select().from(cases);
    },
    findOneById: async (id: number) => {
      return this.drizzleDev
        .selectDistinct()
        .from(cases)
        .where(eq(cases.id, id));
    },
    create: async ({
      prosecutorId,
      defenderId,
      judgeId,
      caseCategory,
      description,
    }: CreateCaseDto) => {
      // The prosecutor,defender,judge ID is already known so we should be able to insert the new case directly instead of having to look them up. Can't find that option yet though

      try {
        const savedCase = await this.drizzleDev
          .insert(cases)
          .values({
            description,
            caseCategory,
            prosecutor: prosecutorId,
            defender: defenderId,
            judge: judgeId,
          })
          .returning({ insertedId: cases.id });

        return savedCase[0].insertedId;
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    },

    resolve: async (id: number, resolution: CaseResultType) => {
      await this.drizzleDev
        .update(cases)
        .set({ caseResult: resolution })
        .where(eq(cases.id, id));
    },

    findAllJudgedBy: async (judgeId: number) => {
      return await this.drizzleDev
        .select()
        .from(cases)
        .where(eq(cases.judge, judgeId));
    },

    findAllWithLawyer: async (lawyerId: number) => {
      return await this.drizzleDev
        .select()
        .from(cases)
        .where(
          or(eq(cases.prosecutor, lawyerId), eq(cases.defender, lawyerId)),
        );
    },
  };
  judges = {
    create: async ({ name }: CreateJudgeDto) => {
      const insertedJudge = await this.drizzleDev
        .insert(judges)
        .values({ name })
        .returning({ insertedId: judges.id });
      return insertedJudge[0].insertedId;
    },
    findAll: async () => {
      return await this.drizzleDev.select().from(judges);
    },
  };

  lawyers = {
    create: async ({ name }: CreateLawyerDto) => {
      const insertedLawyer = await this.drizzleDev
        .insert(lawyers)
        .values({ name })
        .returning({ insertedId: lawyers.id });

      return insertedLawyer[0].insertedId;
    },
    findAll: async () => {
      return await this.drizzleDev.select().from(lawyers);
    },
  };

  protected async initCaseCategories() {}

  protected async initCaseResults() {}
}
