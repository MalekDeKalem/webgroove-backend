var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'webgroove.bht@gmail.com',
    pass: 'ypte ncan loza isof'
  }
});

var mailOptions = {
  from: 'webgroove.bht@gmail.com',
  to: 'm.safwan@hotmail.de',
  subject: 'Sende E-Mail ',
  text: 'Test E-Mail!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});