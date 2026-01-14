import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaProfilesService } from 'src/prisma/prisma-profiles.service';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class StudentService {

  constructor(private readonly prisma: PrismaProfilesService) { }

  async findAll(findWithPagination: PaginationDto) {
    const { page = 1, limit = 10 } = findWithPagination;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        this.prisma.userReference.findMany({
          where: { roleId: 3 }, // 3 = STUDENT
          skip,
          take: limit,
          include: {
            studentProfile: {
              include: {
                career: true,
                studentSubjects: {
                  include: {
                    subject: true
                  }
                }
              }
            }
          }
        }),
        this.prisma.userReference.count({ where: { roleId: 3 } })
      ]);

      return {
        data,
        total,
        page,
        limit
      };

    } catch (error) {
      throw new InternalServerErrorException('Error fetching students');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.userReference.findUnique({
        where: { id },
        include: {
          studentProfile: {
            include: {
              career: true,
              studentSubjects: {
                include: {
                  subject: true
                }
              }
            }
          }
        }
      });

      if (!user || user.roleId !== 3) {
        throw new NotFoundException('Student not found');
      }

      return user;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching student');
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const user = await this.prisma.userReference.findUnique({
        where: { id }
      });

      if (!user || user.roleId !== 3) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      if (updateStudentDto.email) {
        const duplicateEmail = await this.prisma.userReference.findFirst({
          where: {
            email: updateStudentDto.email,
            id: { not: id }
          }
        });

        if (duplicateEmail) {
          throw new ConflictException(`User with email ${updateStudentDto.email} already exists`);
        }
      }

      // Prepare update data for user (UserReference only has name, email, status)
      const userUpdateData = {
        ...(updateStudentDto.name && { name: updateStudentDto.name }),
        ...(updateStudentDto.email && { email: updateStudentDto.email }),
        ...(updateStudentDto.status && { status: updateStudentDto.status }),
        // phone and age are not in UserReference
      };

      // Prepare update data for student profile
      const profileUpdateData = {
        ...(updateStudentDto.careerId && { careerId: updateStudentDto.careerId }),
        ...(updateStudentDto.currentCicle && { currentCicle: updateStudentDto.currentCicle }),
      };

      // Update user and profile
      const updatedUser = await this.prisma.userReference.update({
        where: { id },
        data: {
          ...userUpdateData,
          ...(Object.keys(profileUpdateData).length > 0 && {
            studentProfile: {
              update: profileUpdateData
            }
          })
        },
        include: {
          studentProfile: {
            include: {
              career: true,
              studentSubjects: {
                include: {
                  subject: true
                }
              }
            }
          }
        }
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating student');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.userReference.findUnique({
        where: { id }
      });

      if (!user || user.roleId !== 3) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      // Delete will cascade to studentProfile due to the schema configuration
      await this.prisma.userReference.delete({
        where: { id }
      });

      return { message: `Student with ID ${id} has been successfully removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error removing student');
    }
  }

  // --- NUEVAS CONSULTAS ACTIVIDAD PRÁCTICA ---

  // Parte 1.1: Listar estudiantes activos junto con su carrera
  async findActive() {
    return await this.prisma.studentProfile.findMany({
      where: {
        user: { status: 'active' }
      },
      include: {
        user: true,
        career: true
      }
    });
  }

  // Parte 2.1: Operadores Lógicos (Active AND Career AND Period)
  async findWithFilters(careerId: number, year: number) {
    return await this.prisma.studentProfile.findMany({
      where: {
        AND: [
          { user: { status: 'active' } },
          { careerId: careerId },
          {
            studentSubjects: {
              some: {
                enrolledAt: {
                  gte: new Date(`${year}-01-01`),
                  lte: new Date(`${year}-12-31`)
                }
              }
            }
          }
        ]
      },
      include: {
        user: true,
        career: true,
        _count: { select: { studentSubjects: true } }
      }
    });
  }

  // Parte 3: Consulta SQL Nativa (Reporte Estudiante, Carrera, Total Materias)
  async getStudentReport() {
    const report = await this.prisma.$queryRaw`
      SELECT 
        ur.name AS "studentName", 
        cr.name AS "careerName", 
        COUNT(ss.id)::int AS "totalSubjects"
      FROM student_profile sp
      JOIN user_reference ur ON sp.user_id = ur.id
      JOIN career_reference cr ON sp.career_id = cr.id
      LEFT JOIN student_subject ss ON sp.id = ss.student_profile_id
      GROUP BY ur.name, cr.name
      ORDER BY "totalSubjects" DESC
    `;
    return report;
  }

  // Bonus: Operación Transaccional (ACID) - Matricular estudiante
  async enrollWithTransaction(studentId: number, subjectId: number) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Verificar existencia del estudiante
      const student = await tx.studentProfile.findUnique({ where: { userId: studentId } });
      if (!student) throw new NotFoundException('Estudiante no encontrado');

      // 2. Verificar existencia de la materia
      const subject = await tx.subjectReference.findUnique({ where: { id: subjectId } });
      if (!subject) throw new NotFoundException('Materia no encontrada');

      // 3. Verificar si ya está matriculado
      const existing = await tx.studentSubject.findFirst({
        where: { studentProfileId: student.id, subjectId: subjectId }
      });
      if (existing) throw new BadRequestException('El estudiante ya está matriculado en esta materia');

      // 4. Crear matrícula
      const enrollment = await tx.studentSubject.create({
        data: {
          studentProfileId: student.id,
          subjectId: subjectId,
          status: 'enrolled'
        }
      });

      return enrollment;
    });
  }
}

