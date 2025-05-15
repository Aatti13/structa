import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text)=>{
  try{
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
  }catch(error){
    console.error('Email Error', error);
    throw new Error('Failed to send mail...');
  }
}