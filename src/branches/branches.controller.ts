import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { RequireRole } from '../decorators/require-role.decorator';
import { UserRole } from '../users/entities/users.entity';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @RequireRole(UserRole.Manager)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(+id);
  }

  @Patch(':id')
  @RequireRole(UserRole.Manager)
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  @RequireRole(UserRole.Manager)
  remove(@Param('id') id: string) {
    return this.branchesService.remove(+id);
  }
}
