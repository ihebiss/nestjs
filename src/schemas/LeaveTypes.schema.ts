import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Subtype,SubtypeSchema } from './Subtype.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';
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