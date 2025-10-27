import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

@Schema({ timestamps: true })
export class Restaurant extends Document {
    @Prop({ required: true })
    nameEn: string;

    @Prop({ required: true })
    nameAr: string;

    @Prop({ required: false, type: String })
    descriptionEn: string;

    @Prop({ required: false, type: String })
    descriptionAr: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    createdById: mongoose.Types.ObjectId

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({
        type: [{ type: mongoose.Types.ObjectId, ref: 'Cuisine' }],
        required: true,
        validate: {
            validator: (v: mongoose.Types.ObjectId[]) => v.length >= 1 && v.length <= 3,
            message: 'Restaurant must have between 1 and 3 cuisines'
        }
    })
    cuisinesIds: mongoose.Types.ObjectId[];

    @Prop({
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (v: number[]) => v.length === 2,
                message: 'Coordinates must be an array of exactly 2 numbers: [lng, lat]',
            }
        }
    })
    location: {
        type: string;
        coordinates: [number, number];
    };


    @Prop({ required: true, default: 0, type: Number })
    totalFollowers: number;

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.virtual('cuisines', { ref: 'Cuisine', localField: 'cuisinesIds', foreignField: '_id', justOne: false }); // ensures the cuisines is returned if populated
RestaurantSchema.virtual('createdBy', { ref: 'User', localField: 'createdById', foreignField: '_id', justOne: true });
RestaurantSchema.set('toJSON', { virtuals: true });
RestaurantSchema.set('toObject', { virtuals: true });

// Create geospatial index
RestaurantSchema.index({ location: '2dsphere' });

RestaurantSchema.plugin(mongoosePaginate);
