import { IsInt, IsPositive } from 'class-validator';

export class UpdateTrackDepartmentDto {
  @IsInt()
  @IsPositive()
  departmentId!: number;
}
