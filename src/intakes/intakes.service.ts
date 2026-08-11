import { Injectable } from '@nestjs/common';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';

@Injectable()
export class IntakesService {
  create(createIntakeDto: CreateIntakeDto) {
    return 'This action adds a new intake';
  }

  findAll() {
    return `This action returns all intakes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} intake`;
  }

  update(id: number, updateIntakeDto: UpdateIntakeDto) {
    return `This action updates a #${id} intake`;
  }

  remove(id: number) {
    return `This action removes a #${id} intake`;
  }
}
