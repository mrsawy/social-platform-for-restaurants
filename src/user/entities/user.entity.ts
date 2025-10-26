import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Roles } from '../enums/roles.enum';

@Schema({ _id: false })
class Address {
    @Prop()
    street: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    zipCode: string;

    @Prop()
    country: string;
}

@Schema({ _id: false })
class SocialLinks {
    @Prop()
    linkedin: string;

    @Prop()
    twitter: string;
}

@Schema({ _id: false })
class Profile {

    @Prop()
    bio: string;

    @Prop()
    shortBio: string;

    @Prop()
    dateOfBirth: Date;

    @Prop({ type: Address })
    address: Address;

    @Prop({ type: SocialLinks })
    socialLinks: SocialLinks;

    @Prop({ type: Number, required: true, default: 0 })
    totalFollowing: number
}

@Schema({ _id: false })
class Preferences {
    @Prop()
    language: string;

    @Prop()
    darkMode: boolean;
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Cuisine' })
    favoriteCuisinesIds: Types.ObjectId[];
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({
        required: true,
        unique: true,
        index: true, // Add index for better query performance
        trim: true,
        lowercase: true // Optional: store usernames in lowercase
    })
    username: string;


    @Prop({ required: true, unique: true })
    email: string;


    @Prop({ required: true, unique: true })
    phone: string;


    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: String })
    fullName: string;

    @Prop({ type: Profile, required: false })
    profile: Profile;

    @Prop({ type: Preferences })
    preferences: Preferences;

    @Prop()
    lastLogin: Date;

    @Prop({ default: Roles.USER })
    role: Roles;

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate)

UserSchema.virtual("favoriteCuisines", { ref: 'Cuisine', localField: 'favoriteCuisinesIds', foreignField: '_id', justOne: false })


