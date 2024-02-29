import { connect } from "@/utils/dbConfig";
import { users } from "@/utils/model/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { tokens } from "@/utils/model/tokes";
import { sendEmail } from "@/utils/sendMail";
import Joi from "joi";

connect();
export async function POST(request) {
  try {
    const payload = await request.json();
    const error = validate(payload).error;
    if (error) {
      console.error("Validation error details:", error.details);
      return NextResponse.json({
        result: error.details[0].message,
        details: error.details,
        success: false,
      });
    }
    const Users = await users.findOne({ email: payload.email });

    if (!Users) {
      return NextResponse.json({ result: "invalid email ", success: false });
    }
    if (!Users.password)
      return NextResponse.json({ result: "not authorized", success: false });
    const validPassword = await bcrypt.compare(
      payload.password,
      Users.password
    );
    if (!validPassword) {
      return NextResponse.json({ result: "invalid password", success: false });
    }
    if (Users.pending) {
      const userToken = await tokens.findOne({ userId: Users.id });
      if (!userToken) {
        let newToken = await new tokens({
          userId: Users.id,
          token: crypto.randomBytes(32).toString("Hex"),
        });
        await newToken.save();
        let url = `http://localhost:3000/verify/${newToken.userId}/${newToken.token}`;
        await sendEmail(Users.email, "Verify Email", url);
      }
      return NextResponse.json({
        result: "a email sent to your account",
        success: false,
      });
    } else {
      // const token = Users.generateAuthToken();
      const response = NextResponse.json({
        // result: token,
        result: "Login Successfully",
        success: true,
      });
      // response.cookies.set("authToken",token,{httpOnly:true})
      return response;
    }
  } catch (error) {
    return NextResponse.json({ result: "errors: " + error, success: false });
  }
}

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data);
};
