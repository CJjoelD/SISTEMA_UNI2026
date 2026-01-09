import { Module } from '@nestjs/common';
import { CycleService } from './ciclo.service';
import { CycleController } from './ciclo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule { }