import { Types } from "mongoose";

export class CreateFollowDto {
    restaurantId: Types.ObjectId
    userId: Types.ObjectId
}
