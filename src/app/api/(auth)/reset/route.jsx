import Joi from "joi";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/utils/dbConfig";
import { users } from "@/utils/model/users";
import { tokens } from "@/utils/model/tokes";
import { sendEmail } from "@/utils/sendMail";

connect()
export async function POST(req){
    let info = {};
    const payload = await req.json()
    console.log("payload: ",payload)
    try {
        const emailSchema = Joi.object({
            email: Joi.string().email().required().label("Email")
        })
        const {error} = emailSchema.validate(payload)
        console.log("api/resetpassword/route: ",error)
        if (error)
        {
            info = "please give a correct email format"
            return NextResponse.json({result:info,success:false})
        }
        let user = await users.findOne({email:payload.email})
        if(!user) 
        {
            info = "email not matching"
            return NextResponse.json({result:info,success:false})
        }
        let token = await tokens.findOne({userId:user.id})
        if(!token){
            token = await new tokens({
                userId: user.id,
                token: crypto.randomBytes(32).toString("Hex"),
              }).save()
        }
        const newUrl = `http://localhost:3000/reset/${user.id}/${token.token}`
        await sendEmail(user.email,"Password Reset",newUrl)
        return NextResponse.json({result:"link send in your mail",success:true})
    } catch (error) {
        console.log("api/routepassword:error: ",error)
        return NextResponse.json({result:"error in reset password",success:false})
    }
}