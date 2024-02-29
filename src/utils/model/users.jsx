import mongoose, { Schema} from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, trim: true, unique: true },
  password: { type: String, required: false },
  pending: { type: Boolean, default: true },
  role:{type:String,default:"user"},
  medium:{type:String,default:"email"}
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.TOKENKEY,
    { expiresIn: "1d" }
  );
  return token
};

  export const validate =(data) =>{
    const schema = Joi.object({
        name:Joi.string().required().label("Name"),
        email:Joi.string().required().label("Email"),
        password:passwordComplexity().required().label("Password")
    })
    return schema.validate(data)
  }

  export const users =
  mongoose.models.users || mongoose.model("users", userSchema);
