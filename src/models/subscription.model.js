
import mongoose , {Schema} from "mongoose";
const subscriptionSchema = new Schema({
   subscriber : {
    // who is subscribing(user)
    type : Schema.Types.ObjectId,
    ref : "User"
    // no need to import
   },
   channel : {
    // channel is also a user that user subscribe
    type : Schema.Types.ObjectId,
    ref : "User"
   }
}, {timestamps : true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)