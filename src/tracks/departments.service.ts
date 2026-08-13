import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepo.create(createDepartmentDto);
    const saveResult = await this.departmentRepo.save(department);

    this.logger.log(
      `Department with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.departmentRepo.find();
  }

  async findOne(id: number) {
    const department = await this.departmentRepo.findOneBy({ id });

    if (!department) {
      this.logger.warn(`Department with id ${id} is not found`);
      throw new NotFoundException('department not found');
    }
    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.findOne(id);

    Object.assign(department, updateDepartmentDto);
    const saveResult = await this.departmentRepo.save(department);

    this.logger.log(`Department with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    const removeResult = await this.departmentRepo.remove(department);

    this.logger.log(`Department with id ${id} has been removed successfully`);
    return removeResult;
  }
}
