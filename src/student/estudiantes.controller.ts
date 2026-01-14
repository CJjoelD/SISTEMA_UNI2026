import { Controller, Get, Post, Patch, Param, Delete, Query, Body, ParseIntPipe } from '@nestjs/common';
import { StudentService } from './estudiantes.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @ApiOperation({ summary: 'Get all students' })
  @Get()
  findAll(@Query() findWithPagination: PaginationDto) {
    return this.studentService.findAll(findWithPagination);
  }

  @ApiOperation({ summary: 'Listar estudiantes activos con carrera' })
  @Get('active/list')
  findActive() {
    return this.studentService.findActive();
  }

  @ApiOperation({ summary: 'Reporte nativo de estudiantes' })
  @Get('report/stats')
  getReport() {
    return this.studentService.getStudentReport();
  }

  @ApiOperation({ summary: 'Búsqueda avanzada de estudiantes (Lógica)' })
  @Get('search/advanced')
  searchAdvanced(
    @Query('careerId', ParseIntPipe) careerId: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.studentService.findWithFilters(careerId, year);
  }

  @ApiOperation({ summary: 'Get a student by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a student profile' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Delete a student' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @ApiOperation({ summary: 'Matricular con transacción (ACID)' })
  @Post('enroll-transaction')
  enroll(
    @Body('studentId', ParseIntPipe) studentId: number,
    @Body('subjectId', ParseIntPipe) subjectId: number,
  ) {
    return this.studentService.enrollWithTransaction(studentId, subjectId);
  }
}
