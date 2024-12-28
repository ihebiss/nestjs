import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class UpdateLeaveEmployeesDto {
  @IsOptional()
  employeeId?: string;

  @IsOptional()
  leaveTypeId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  startPeriod?: string;

  @IsOptional()
  endPeriod?: string;

  @IsOptional()
  subtype?: string;

  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected','Approved by TeamLead'])
  status?: string;

  @IsOptional()
  explanation?: string;

  @IsOptional()
  attachment?: string;
  @IsOptional()
  reason: string;
}
