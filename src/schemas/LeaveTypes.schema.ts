import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Subtype,SubtypeSchema } from './Subtype.schema';

@Schema()
export class LeaveType extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    nbdays: number;

    @Prop({ type: [SubtypeSchema], default: [] })
    subtypes: Subtype[];
}
export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);