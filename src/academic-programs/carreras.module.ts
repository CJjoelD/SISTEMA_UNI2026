import { Module } from '@nestjs/common';
import { CareerService } from './carreras.service';
import { CareerController } from './carreras.controller';
import { PrismaAcademicService } from 'src/prisma/prisma-academic.service';

@Module({
  controllers: [CareerController],
  providers: [CareerService, PrismaAcademicService],
})
export class CareerModule { }