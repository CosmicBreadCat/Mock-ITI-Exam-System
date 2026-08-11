import { Test, TestingModule } from '@nestjs/testing';
import { CourseClassesController } from './course-classes.controller';
import { CourseClassesService } from './course-classes.service';

describe('CourseClassesController', () => {
  let controller: CourseClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseClassesController],
      providers: [CourseClassesService],
    }).compile();

    controller = module.get<CourseClassesController>(CourseClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
