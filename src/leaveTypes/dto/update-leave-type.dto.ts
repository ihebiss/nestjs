
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubtypeDto } from './create-subtype.dto';

export class UpdateLeaveTypeDto {
 
  @IsOptional()
  @IsString()
   name?: string;

  @IsOptional()
  @IsNumber()
   nbdays?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtypeDto)
   subtypes?: CreateSubtypeDto[];
}
