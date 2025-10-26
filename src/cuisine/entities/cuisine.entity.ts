import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

@Schema({ timestamps: true })
export class Cuisine extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ required: false, type: String })
    description?: string;
}

export const CuisineSchema = SchemaFactory.createForClass(Cuisine);
CuisineSchema.plugin(mongoosePaginate);