import { users, validate } from "@/utils/model/users";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { tokens } from "@/utils/model/tokes";
import { sendEmail } from "@/utils/sendMail";
import { NextResponse } from "next/server";
import { connect } from "@/utils/dbConfig";

connect()
export async function POST(req) {
  try {
    const payload = await req.json();
    console.log(payload)
    const { error } = validate(payload);
    if (error) {
      return NextResponse.json({ result: error.details[0].message, success: false });
    }
    const findEmail = await users.findOne({ email: payload.email });
    if (findEmail)
    return NextResponse
        .json({
          result: "email already used, try another mail",
          success: false,
        });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    const newUser = new users({ ...payload, password: hashedPassword });
    await newUser.save();
    const newToken = new tokens({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("Hex"),
    });
    await newToken.save();
    const url = `http://localhost:3000/verify/${newToken.userId}/${newToken.token}`;
    await sendEmail(newUser.email, "verify email", url);
    return NextResponse
      .json({ result: "a link send to your mail", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse
      .json({ result: "something wrong to sign up", success: false });
  }
}
