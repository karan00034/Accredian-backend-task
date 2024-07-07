const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., 'gmail', 'yahoo', etc.)
    auth: {
        user: 'kb29112001@gmail.com', // Your email address
        pass: 'rmur bqbx jdko flts'   // Your email password
    },
    tls: {
        rejectUnauthorized: false // Add this line to disable SSL verification
    }
});

// Set up email data with unicode symbols
let mailOptions = {
    from: '"Your Name" <your-email@gmail.com>', // Sender address
    to: 'kb0888547@gmail.com',          // List of recipients
    subject: 'Hello',                           // Subject line
    text: 'Hello world?',                       // Plain text body
    html: '<b>Hello world?</b>'                 // HTML body
};

// Send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
