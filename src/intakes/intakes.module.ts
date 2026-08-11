import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntakesService } from './intakes.service';
import { IntakesController } from './intakes.controller';
import { Intake } from './entities/intake.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Intake])],
  exports: [IntakesService],
  controllers: [IntakesController],
  providers: [IntakesService],
})
export class IntakesModule {}
