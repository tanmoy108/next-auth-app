import Joi from "joi";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import passwordComplexity from "joi-password-complexity";
import { connect } from "@/utils/dbConfig";
import { users } from "@/utils/model/users";
import { tokens } from "@/utils/model/tokes";

connect();

export async function GET(req, { params }) {
  console.log(params);
  try {
    let info = {};
    const verifiedUser = await users.findById(params.id);
    console.log("verifiedUser", verifiedUser);
    if (!verifiedUser) {
      info = "user not verified";
      return NextResponse.json({ result: info, success: false });
    }
    let verifiedToken = await tokens.findOne({
      userId: verifiedUser.id,
      token: params.token,
    });
    if (!verifiedToken) {
      info = "not verified";
      return NextResponse.json({ result: info, success: false });
    }
    return NextResponse.json({
      result: "you can reset your password",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      result: "error in reset password",
      success: false,
    });
  }
}

export async function POST(req, { params }) {
  let info = {};
  try {
    const payload = await req.json();
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(payload);
    if (error)
      return NextResponse.json({
        result: error.details[0].message,
        success: false,
      });
    const user = await users.findById(params.id);
    if (!user)
      return NextResponse.json({ result: "user not verified", success: false });
    let verifiedToken = await tokens.findOne({
      userId: user.id,
      token: params.token,
    });
    if (!verifiedToken) {
      info = "not verified";
      return NextResponse.json({ result: info, success: false });
    }
    if (user.pending) user.pending = false;
    const salt = await bcrypt.genSalt(Number(process.env.SALTNUM));
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    user.password = hashedPassword;
    await user.save();
    await tokens.deleteOne({
      userId: user.id,
      token: params.token,
    });
    return NextResponse.json({ result: "Reset SuccessFull", success: true });
  } catch (error) {
    return NextResponse.json({
      result: "error in reset password",
      success: false,
    });
  }
}