import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubtypeDto } from './create-subtype.dto';

export class CreateLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsNumber()
  nbdays: number;

  @ValidateNested({ each: true })
  @Type(() => CreateSubtypeDto)
  subtypes: CreateSubtypeDto[];
}