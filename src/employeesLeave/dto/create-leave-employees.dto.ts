import { IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateLeaveEmployeesDto {
  @IsNotEmpty()
  employeeId: string;

  @IsNotEmpty()
  leaveTypeId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  startPeriod: string;

  @IsNotEmpty()
  endPeriod: string;

  @IsOptional()
  subtype: string;

  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  status: string;

  @IsOptional()
  explanation: string;

  @IsOptional()
  attachment: string;
}
