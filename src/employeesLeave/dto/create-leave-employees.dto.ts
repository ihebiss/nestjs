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
  subtype?: string;
  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected','Approved by TeamLead'])
  status: string;

  @IsOptional()
  explanation: string;

  @IsOptional()
  attachment: string;
  @IsOptional()
   keycloakId: string;
   @IsOptional()
   reason: string;
}
