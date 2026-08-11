import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { Branch } from './entities/branch.entity';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, City])],
  exports: [BranchesService],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}
