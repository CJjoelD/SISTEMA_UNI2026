import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CycleService } from './ciclo.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('semesters')
@Controller('semesters')
export class CycleController {
  constructor(private readonly cycleService: CycleService) { }

  @ApiOperation({ summary: 'Create a new academic semester' })
  @Post()
  create(@Body() createCycleDto: CreateCycleDto) {
    return this.cycleService.create(createCycleDto);
  }

  @ApiOperation({ summary: 'ger all academic semesters' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.cycleService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get the active semester' })
  @Get('active')
  findActive() {
    return this.cycleService.findActive();
  }

  @ApiOperation({ summary: 'Get an academic cycle by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cycleService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an academic semester' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCycleDto: UpdateCycleDto) {
    return this.cycleService.update(+id, updateCycleDto);
  }

  @ApiOperation({ summary: 'Delete an academic semester' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cycleService.remove(+id);
  }
}
