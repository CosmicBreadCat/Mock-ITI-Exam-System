import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { CitiesService } from './cities.service';
import { BranchesController } from './branches.controller';
import { CitiesController } from './cities.controller';
import { Branch } from './entities/branch.entity';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, City])],
  exports: [BranchesService, CitiesService],
  controllers: [BranchesController, CitiesController],
  providers: [BranchesService, CitiesService],
})
export class BranchesModule {}
