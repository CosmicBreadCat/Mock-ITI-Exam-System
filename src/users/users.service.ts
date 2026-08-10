import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(name: string, email: string, password: string) {
    const user = this.repo.create({ name, email, password });
    const saveResult = await this.repo.save(user);

    this.logger.log(
      `User with id ${user.id} has been created and saved successfully`,
    );
    return saveResult;
  }

  findByEmail(email: string) {
    if (!email) return null;
    return this.repo.findOneBy({ email });
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with id ${id} is not found in user update.`);
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);
    const saveResult = await this.repo.save(user);

    this.logger.log(`User with id ${id} has been updated successfully`);
    return saveResult;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      this.logger.warn(`User with id ${id} is not found in user remove.`);
      throw new NotFoundException('user not found');
    }

    const removeResult = await this.repo.remove(user);

    this.logger.log(`User with id ${id} has been removed successfully`);
    return removeResult;
  }
}
