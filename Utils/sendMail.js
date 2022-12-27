const nodemailer = require("nodemailer");
// const path = require("path");
// const fs = require("fs");

// Send Mail
async function sendMail(reciever, subject, emailBody) {
  try {
    let transporter = nodemailer.createTransport({
      host: `smtp.mail.${process.env.AWS_FALLBACK_REGION}.awsapps.com`,
      port: 465,
      secure: true,
      auth: {
        user: process.env.AWS_WORKMAIL_EMAIL,
        pass: process.env.AWS_WORKMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.AWS_WORKMAIL_EMAIL,
      to: reciever,
      subject: subject,
      html: emailBody,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.error("error", error);
    return error;
  }
}

module.exports = { sendMail };
