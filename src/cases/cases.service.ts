import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Case,
  CaseResult,
  CaseCategory,
  Judge,
  Lawyer,
} from './entity/cases.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCaseDto,
  CreateJudgeDto,
  CreateLawyerDto,
} from './entity/Dtos/createDto';
import { CASE_CATEGORIES } from './entity/case.types';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private casesRepository: Repository<Case>,

    @InjectRepository(Lawyer)
    private lawyersRepository: Repository<Lawyer>,

    @InjectRepository(Judge)
    private judgesRepository: Repository<Judge>,

    @InjectRepository(CaseCategory)
    private caseCategoryRepository: Repository<CaseCategory>,
  ) {
    this.initCaseCategories();
  }

  cases = {
    findAll: async () => {
      return this.casesRepository.find();
    },
    findOneById: async (id: number) => {
      return await this.casesRepository.findOneBy({ id });
    },
    create: async ({
      prosecutorId,
      defenderId,
      judgeId,
      caseCategory: _caseCategory,
      description,
    }: CreateCaseDto) => {
      // The prosecutor,defender,judge ID is already known so we should be able to insert the new case directly instead of having to look them up. Can't find that option yet though

      try {
        const getProsecutorPromise = this.lawyersRepository.findOneByOrFail({
          id: prosecutorId,
        });
        const getDefenderPromise = this.lawyersRepository.findOneByOrFail({
          id: defenderId,
        });
        const getJudgePromise = this.judgesRepository.findOneByOrFail({
          id: judgeId,
        });
        const getCaseCategoryPromise =
          this.caseCategoryRepository.findOneByOrFail({
            type: _caseCategory,
          });

        const relationValues = await Promise.all([
          getProsecutorPromise,
          getDefenderPromise,
          getJudgePromise,
          getCaseCategoryPromise,
        ]);

        const [prosecutor, defender, judge, caseCategory] = relationValues;

        const newCase = new Case();

        newCase.caseType = caseCategory;
        newCase.prosecutor = prosecutor;
        newCase.defender = defender;
        newCase.judge = judge;
        newCase.description = description;
        // I added description as a column later but I didn't get any compile time errors even though I forgot to add it in the properties above.
        // ! This is potentially a **big** problem
        const savedCase = await this.casesRepository.save(newCase);

        return savedCase.id;
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    },

    resolve: async (caseId: number, resolution: CaseResult) => {
      const caseToResolve = await this.casesRepository.findOne({
        where: { id: caseId },
      });
      caseToResolve.caseResult = resolution;
      await this.casesRepository.save(caseToResolve);
    },

    findAllJudgedBy: async (judgeId: number) => {
      return await this.casesRepository.find({
        where: { judge: { id: judgeId } },
      });
    },

    findAllWithLawyer: async (lawyerId: number) => {
      return await this.casesRepository.find({
        where: [
          { prosecutor: { id: lawyerId } },
          { defender: { id: lawyerId } },
        ],
      });
    },
  };
  judges = {
    create: async ({ name }: CreateJudgeDto) => {
      const newJudge = new Judge();
      newJudge.name = name;

      const savedJudge = await this.judgesRepository.save(newJudge);

      return savedJudge.id;
    },
    findAll: async () => {
      return await this.judgesRepository.find();
    },
  };

  lawyers = {
    create: async ({ name }: CreateLawyerDto) => {
      const newLawyer = new Lawyer();
      newLawyer.name = name;

      const savedLawyer = await this.lawyersRepository.save(newLawyer);

      return savedLawyer.id;
    },
    findAll: async () => {
      return await this.lawyersRepository.find();
    },
  };

  private async initCaseCategories() {
    const caseCategoriesEntities = await this.caseCategoryRepository.find();
    const caseCategories = caseCategoriesEntities.map(
      (caseCategoryEntity) => caseCategoryEntity.type,
    );
    if (caseCategories.length === 0) {
      const caseCategoriesEntityArr = CASE_CATEGORIES.map((category) => {
        return {
          type: category,
        };
      });
      const caseCatgoryEntitiesToInit = this.caseCategoryRepository.create(
        caseCategoriesEntityArr,
      );
      // https://stackoverflow.com/questions/64561818/how-do-insert-multiple-entities-and-return-them-in-typeorm
      // save: separate query for each entity. Hence, use insert
      await this.caseCategoryRepository.insert(caseCatgoryEntitiesToInit);
    } else if (caseCategories.length === CASE_CATEGORIES.length) {
      CASE_CATEGORIES.forEach((category) => {
        if (!caseCategories.includes(category))
          throw new Error(
            `Case Category: ${category} - missing in the reference table`,
          );
      });
    } else throw new Error(`Case Categories are misconfigured`);
  }
}
