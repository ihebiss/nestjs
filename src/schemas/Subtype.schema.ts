import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subtype extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ })
    nbdays: number;
}

export const SubtypeSchema = SchemaFactory.createForClass(Subtype);
