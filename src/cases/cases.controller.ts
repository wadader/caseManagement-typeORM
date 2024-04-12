import { Body, Controller, Get, Post } from '@nestjs/common';
import { CasesService } from './cases.service';
import {
  CreateCaseDto,
  CreateJudgeDto,
  CreateLawyerDto,
} from './entity/Dtos/createDto';

@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Get()
  findAll() {
    return this.casesService.cases.findAll();
  }

  @Post('case')
  async createCase(@Body() createCaseDto: CreateCaseDto) {
    const createdCaseId = await this.casesService.cases.create(createCaseDto);
    return { id: createdCaseId };
  }

  @Post('judge')
  async createJudge(@Body() createJudgeDto: CreateJudgeDto) {
    const insertedJudgeId =
      await this.casesService.judges.create(createJudgeDto);
    return { id: insertedJudgeId };
  }

  @Get('judge')
  GetJudges() {
    return this.casesService.judges.findAll();
  }

  @Post('lawyer')
  async createLawyer(@Body() createLawyerDto: CreateLawyerDto) {
    const insertedLawyerId =
      await this.casesService.lawyers.create(createLawyerDto);

    return { id: insertedLawyerId };
  }

  @Get('lawyer')
  getLawyers() {
    return this.casesService.lawyers.findAll();
  }
}
