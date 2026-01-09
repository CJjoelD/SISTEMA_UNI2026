import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CareerService } from './carreras.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('academic-programs')
@Controller('academic-programs')
export class CareerController {
  constructor(private readonly careerService: CareerService) { }

  @ApiOperation({ summary: 'Create a new academicprogram' })
  @Post()
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.create(createCareerDto);
  }

  @ApiOperation({ summary: 'Get all academicprograms' })
  @Get()
  findAll(@Query() findWithPagination: PaginationDto) {
    return this.careerService.findAll(findWithPagination);
  }

  @ApiOperation({ summary: 'Get a academicprogram by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a academicprogram' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careerService.update(+id, updateCareerDto);
  }

  @ApiOperation({ summary: 'Delete a academicprogram' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.careerService.remove(+id);
  }
}