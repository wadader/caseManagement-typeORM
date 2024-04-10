import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CasesController } from './cases/cases.controller';

@Module({
  imports: [],
  controllers: [AppController, CasesController],
  providers: [AppService],
})
export class AppModule {}
