import { Controller, Get, Patch, Param, Delete, Query, Body } from '@nestjs/common';
import { TeacherService } from './profesores.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('instructors')
@Controller('instructors')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @ApiOperation({ summary: 'Get all instructors' })
  @Get()
  findAll(@Query() findWithPagination: PaginationDto) {
    return this.teacherService.findAll(findWithPagination);
  }

  @ApiOperation({ summary: 'Get a instructor by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a instructor profile' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @ApiOperation({ summary: 'Delete a intructor profile' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
