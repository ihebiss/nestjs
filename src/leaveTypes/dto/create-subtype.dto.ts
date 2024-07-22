import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubtypeDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
  
    @IsNumber()
    nbdays: number;
  }
  