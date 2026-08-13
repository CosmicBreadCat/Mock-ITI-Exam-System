import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { City } from './entities/city.entity';

@Injectable()
export class BranchesService {
  private readonly logger = new Logger(BranchesService.name);

  constructor(
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepo.create({
      name: createBranchDto.name,
      city: { id: createBranchDto.cityId },
    });
    const saveResult = await this.branchRepo.save(branch);

    this.logger.log(
      `Branch with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.branchRepo.find({ relations: { city: true } });
  }

  async findOne(id: number) {
    const branch = await this.branchRepo.findOne({
      where: { id },
      relations: { city: true },
    });

    if (!branch) {
      this.logger.warn(`Branch with id ${id} is not found`);
      throw new NotFoundException('branch not found');
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.findOne(id);
    const { cityId, ...attrs } = updateBranchDto;

    Object.assign(branch, attrs);
    if (cityId !== undefined) branch.city = { id: cityId } as City;
    const saveResult = await this.branchRepo.save(branch);

    this.logger.log(`Branch with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const branch = await this.findOne(id);
    const removeResult = await this.branchRepo.remove(branch);

    this.logger.log(`Branch with id ${id} has been removed successfully`);
    return removeResult;
  }
}
