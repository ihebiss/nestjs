import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { leaveTypesService } from './leaveTypes.service';
import { LeaveTypeController } from './leaveTypes.controller';
import { LeaveType,LeaveTypeSchema } from 'src/schemas/LeaveTypes.schema';
import { Subtype,SubtypeSchema } from 'src/schemas/Subtype.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveType.name, schema: LeaveTypeSchema },
      { name: Subtype.name, schema: SubtypeSchema },
  
    ]),
  ],
  controllers: [LeaveTypeController],
  providers: [leaveTypesService],
})
export class LeaveTypeModule {}
