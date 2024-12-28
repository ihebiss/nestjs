import { IsArray, IsMongoId, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SubtypeDto {
  @IsOptional()
  @IsNumber()
  nbdays?: number;

  @IsOptional()
 
  name?: string;
}

export class UpdateEmployeeLeaveBalanceDto {
  @IsMongoId()
  leaveTypeId: string;

  @IsNumber()
  balance: number;

  @IsArray()
  @Type(() => SubtypeDto)
  subtypes: SubtypeDto[];
}
