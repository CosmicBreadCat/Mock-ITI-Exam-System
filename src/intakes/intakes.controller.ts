import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IntakesService } from './intakes.service';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { RequireRole } from '../decorators/require-role.decorator';
import { UserRole } from '../users/entities/users.entity';

@Controller('intakes')
export class IntakesController {
  constructor(private readonly intakesService: IntakesService) {}

  @Post()
  @RequireRole(UserRole.Manager)
  create(@Body() createIntakeDto: CreateIntakeDto) {
    return this.intakesService.create(createIntakeDto);
  }

  @Get()
  findAll() {
    return this.intakesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intakesService.findOne(+id);
  }

  @Patch(':id')
  @RequireRole(UserRole.Manager)
  update(@Param('id') id: string, @Body() updateIntakeDto: UpdateIntakeDto) {
    return this.intakesService.update(+id, updateIntakeDto);
  }

  @Delete(':id')
  @RequireRole(UserRole.Manager)
  remove(@Param('id') id: string) {
    return this.intakesService.remove(+id);
  }
}
