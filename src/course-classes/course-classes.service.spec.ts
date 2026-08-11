import { Test, TestingModule } from '@nestjs/testing';
import { CourseClassesService } from './course-classes.service';

describe('CourseClassesService', () => {
  let service: CourseClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseClassesService],
    }).compile();

    service = module.get<CourseClassesService>(CourseClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
