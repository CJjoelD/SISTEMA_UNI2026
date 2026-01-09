// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

// --- NUEVAS RUTAS ABSOLUTAS UTILIZANDO 'src/' ---

// 1. SpecialityModule: Evita anidamiento complejo
import { SpecialityModule } from 'src/concentrations/especialidades.module';

// 2. CareerModule: Evita anidamiento
import { CareerModule } from 'src/academic-programs/carreras.module';

// 3. TeacherModule
import { TeacherModule } from 'src/instructors/profesores.module';

// 4. SubjectModule
import { SubjectModule } from 'src/subject/subject.module';

// 5. StudentsubjectModule
import { StudentsubjectModule } from 'src/studentsubject/studentsubject.module';

// 6. StudentModule
import { StudentModule } from 'src/student/estudiantes.module';

// 7. AuthModule
import { AuthModule } from 'src/auth/auth.module';

// 8. CycleModule: ¡LA RUTA PROBLEMÁTICA RESUELTA! (sin el './')
// Importando directamente el archivo en la carpeta 'semesters'
import { CycleModule } from 'src/semesters/ciclo.module'; 

// Importaciones de servicios Prisma también deben usar el alias para consistencia
import { PrismaUsersService } from 'src/prisma/prisma-users.service';
import { PrismaAcademicService } from 'src/prisma/prisma-academic.service';
import { PrismaProfilesService } from 'src/prisma/prisma-profiles.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    SpecialityModule,
    CareerModule,
    TeacherModule,
    SubjectModule,
    StudentsubjectModule,
    StudentModule,
    AuthModule,
    CycleModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaUsersService,
    PrismaAcademicService,
    PrismaProfilesService,
  ],
  exports: [
    PrismaUsersService,
    PrismaAcademicService,
    PrismaProfilesService,
  ]
})
export class AppModule { }