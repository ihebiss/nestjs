import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema()
export class LeaveBalance {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'LeaveType' })
  leaveTypeId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 0 })
  balance: number;
}


@Schema()
export class Employee extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['Employee', 'Manager', 'TeamLead'] })
  role: string;

  @Prop()
  department: string;

  @Prop()
  color: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Employee' })
  TeamLeadId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: [LeaveBalance], default: [] })  
  leaveBalances: LeaveBalance[];
}


export const EmployeeSchema = SchemaFactory.createForClass(Employee);
