import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
export class LeaveBalanceDto {
  @IsOptional()
  @IsString()
  leaveTypeId?: string;

  @IsOptional()
  days?: number;
}
export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsIn(['Employee', 'Manager', 'TeamLead'])
  readonly role?: string;

  @IsOptional()
  @IsString()
  readonly department?: string;

  @IsOptional()
  @IsString()
   color?: string;

  @IsOptional()
  @IsString()
   TeamLeadId?: string;
   @IsOptional() 
   keycloakId: string;
   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => LeaveBalanceDto)
   leaveBalances?: LeaveBalanceDto[];
   
}
