import { Module } from '@nestjs/common';
import { TeacherService } from './profesores.service';
import { TeacherController } from './profesores.controller';
import { PrismaProfilesService } from 'src/prisma/prisma-profiles.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, PrismaProfilesService],
})
export class TeacherModule { }
