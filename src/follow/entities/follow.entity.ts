import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from "mongoose-paginate-v2";

@Schema({ timestamps: true })
export class Follow extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurantId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.virtual('user', { ref: 'User', localField: 'userId', foreignField: '_id', justOne: true });
FollowSchema.virtual('restaurant', { ref: 'Restaurant', localField: 'restaurantId', foreignField: '_id', justOne: true });

FollowSchema.set('toJSON', { virtuals: true });
FollowSchema.set('toObject', { virtuals: true });

// Ensure a user can't follow the same restaurant twice
FollowSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

FollowSchema.plugin(mongoosePaginate);


