import mongoose, { Schema } from "mongoose";


const tokenSchema = new Schema({
    userId:{type:Schema.Types.ObjectId,required:true,ref:"users"},
    token:{type:String,required:true},
})

export const tokens = mongoose.models.tokens || mongoose.model("tokens",tokenSchema) 