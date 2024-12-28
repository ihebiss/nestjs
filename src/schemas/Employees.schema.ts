import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';
import { Subtype, SubtypeSchema } from './Subtype.schema';
@Schema()
export class LeaveBalance {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'LeaveType' })
  leaveTypeId: MongooseSchema.Types.ObjectId;

  @Prop({required: false,default:0})
  balance: number;
 
  @Prop({ type: [SubtypeSchema], default: [] })
  subtypes: Subtype[];
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
  @Prop({ required: true, unique: true })
  keycloakId: string;  
}


export const EmployeeSchema = SchemaFactory.createForClass(Employee);
