import { Module } from '@nestjs/common';
import { StudentService } from './estudiantes.service';
import { StudentController } from './estudiantes.controller';
import { PrismaProfilesService } from 'src/prisma/prisma-profiles.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaProfilesService],
})
export class StudentModule { }
