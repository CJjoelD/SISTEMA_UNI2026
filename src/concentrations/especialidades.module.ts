import { Module } from '@nestjs/common';
import { SpecialityService } from './especialidades.service';
import { SpecialityController } from './especialidades.controller';
import { PrismaAcademicService } from 'src/prisma/prisma-academic.service';

@Module({
  controllers: [SpecialityController],
  providers: [SpecialityService, PrismaAcademicService],
})
export class SpecialityModule { }