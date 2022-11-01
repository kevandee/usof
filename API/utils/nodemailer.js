const nodemailer = require('nodemailer');
const config = require('../config.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

function sendLetter(email, subject, text) {
    let message = {
        from: `achaika <${config.email.user}>`,
        to: email,
        subject: subject,
        text: text
      };
      // nodemailer
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = sendLetter;
