import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  constructor(@InjectRepository(City) private cityRepo: Repository<City>) {}

  async create(createCityDto: CreateCityDto) {
    const city = this.cityRepo.create(createCityDto);
    const saveResult = await this.cityRepo.save(city);

    this.logger.log(
      `City with id ${saveResult.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findAll() {
    return this.cityRepo.find();
  }

  async findOne(id: number) {
    const city = await this.cityRepo.findOneBy({ id });

    if (!city) {
      this.logger.warn(`City with id ${id} is not found`);
      throw new NotFoundException('city not found');
    }
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.findOne(id);

    Object.assign(city, updateCityDto);
    const saveResult = await this.cityRepo.save(city);

    this.logger.log(`City with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const city = await this.findOne(id);
    const removeResult = await this.cityRepo.remove(city);

    this.logger.log(`City with id ${id} has been removed successfully`);
    return removeResult;
  }
}
