import { connect } from "@/utils/dbConfig";
import { tokens } from "@/utils/model/tokes";
import { users } from "@/utils/model/users";
import { NextResponse } from "next/server";

connect();
export async function GET(req, { params }) {
  try {
    const exitingUser = await users.findById(params.id);
    if (!exitingUser)
      return NextResponse.json({
        result: "not authorized",
        success: false,
      });
    const exitingToken = await tokens.findOne({
      userId: params.id,
      token: params.token,
    });
    if (!exitingToken)
      return NextResponse.json({
        result: "invalid link",
        success: false,
      });
    await users.findByIdAndUpdate(exitingUser.id, { pending: false });
    await tokens.deleteOne({ userId: params.id, token: params.token });
    return NextResponse.json({ result: "verified", success: true });
  } catch (error) {
    return NextResponse.json({
      result: "some error",
      success: false,
    });
  }
}
