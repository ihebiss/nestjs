import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsIn, IsOptional, ValidateNested, IsString } from 'class-validator';
export class LeaveBalanceDto {
  @IsNotEmpty()
  @IsString()
  leaveTypeId: string;

  @IsOptional()
  days: number;
}
export class AddEmployeeDto {
  @IsNotEmpty()
   firstName: string;

  @IsNotEmpty()
   lastName: string;

  @IsEmail()
   email: string;

  @IsNotEmpty()
   password: string;

  @IsNotEmpty()
  @IsIn(['Employee', 'Manager', 'TeamLead'])
   role: string;


   department: string;
   @IsNotEmpty()
   keycloakId: string;
   color?: string;
   TeamLeadId?: string;
   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => LeaveBalanceDto)
   leaveBalances?: LeaveBalanceDto[];
}
