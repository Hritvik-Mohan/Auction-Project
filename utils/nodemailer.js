/**
 * Module Imports.
 */
const nodemailer = require("nodemailer");

/**
 * 
 * @param {string} email | email of the user
 * @param {string} subject | subject of the email 
 * @param {string} html | html of the email
 */
const sendMail = async (email, subject, html) => {

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "yahoo",
    auth: {
      user: process.env.MAIL_ACC, 
      pass: process.env.MAIL_PASS, 
    },
  });

  const options = {
    from: process.env.MAIL_ACC,
    to: email,
    subject,
    html
  }

  const info = await transporter.sendMail(options);

  console.log("Message sent: %s", info.messageId);

  return info
}

module.exports = sendMail;