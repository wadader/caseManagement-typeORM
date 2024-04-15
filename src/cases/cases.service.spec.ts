import { Test, TestingModule } from '@nestjs/testing';
import { CasesService } from './cases.service';
import { selectedProvider } from './cases.module';

describe('CasesService', () => {
  let service: CasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [selectedProvider.serviceProvider],
    }).compile();

    service = module.get<CasesService>(CasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
