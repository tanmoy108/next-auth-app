import nodemailer from "nodemailer"
export const sendEmail = async(email,subject,text)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:"smtp.mail.yahoo.com",
            service:"yahoo",
            port:465,
            secure:true,
            auth:{
                user:process.env.APP_MAIL,
                pass:process.env.APP_PASSWORD
            }
        })

        await transporter.sendMail({
            from:process.env.APP_MAIL,
            to:email,
            subject:subject,
            text:text
        })

    } catch (error) {
        throw error      
    }
}