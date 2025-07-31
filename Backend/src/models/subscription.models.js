import mongoose, {Schema} from mongoose

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, //The one who's subscribing
        ref:"User"
    },

    channel:{
        type: Schema.Types.ObjectId, //The one who's being subscribed to
        ref:"User"
    }

},{timestamps:true})

export const Subscription= mongoose.model("Subscription", subscriptionSchema)