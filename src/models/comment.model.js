import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
  content : {
    type : String,
    required : true
  },
  video : {
    // single video for comment
    type : Schema.Types.ObjectId,
    ref : "Video"
  },
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User"
  }
}, {timestamps: true})


// Plugin give ability to control paginate(example :- provide video where to where)
commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)