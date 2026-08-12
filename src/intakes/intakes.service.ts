import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';
import { Intake } from './entities/intake.entity';

@Injectable()
export class IntakesService {
  private readonly logger = new Logger(IntakesService.name);

  constructor(
    @InjectRepository(Intake) private intakeRepo: Repository<Intake>,
  ) {}

  async create(createIntakeDto: CreateIntakeDto) {
    const intake = this.intakeRepo.create(createIntakeDto);
    const saveResult = await this.intakeRepo.save(intake);

    this.logger.log(
      `Intake with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.intakeRepo.find();
  }

  async findOne(id: number) {
    const intake = await this.intakeRepo.findOneBy({ id });

    if (!intake) {
      this.logger.warn(`Intake with id ${id} is not found`);
      throw new NotFoundException('intake not found');
    }
    return intake;
  }

  async update(id: number, updateIntakeDto: UpdateIntakeDto) {
    const intake = await this.findOne(id);

    Object.assign(intake, updateIntakeDto);
    const saveResult = await this.intakeRepo.save(intake);

    this.logger.log(`Intake with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const intake = await this.findOne(id);
    const removeResult = await this.intakeRepo.remove(intake);

    this.logger.log(`Intake with id ${id} has been removed successfully`);
    return removeResult;
  }
}
