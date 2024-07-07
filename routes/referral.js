const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  
  tls: {
    rejectUnauthorized: false // Add this line to disable SSL verification
}
});

// Helper function to send referral email
async function sendReferralEmail(referral) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: referral.refereeEmail,
    subject: 'You have been referred!',
    text: `Hi ${referral.refereeName},\n\nYou have been referred by ${referral.referrerName} (${referral.referrerEmail}).\n\nMessage: You have been referred by ${referral.referrerCompany}. Your relationship with the referrer is ${referral.relationshipWithReferee}.\n\nBest regards,\nYour Company`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Referral email sent successfully.');
  } catch (error) {
    console.error('Error sending referral email:', error);
  }
}

// Endpoint to create a new referral
router.post('/', async (req, res) => {
  const { referrerName, referrerEmail, referrerPhoneNumber, referrerCompany, relationshipWithReferee, refereeName, refereeEmail, refereePhoneNumber, refereeCompany } = req.body;

  // Validate input
  if (!referrerName || !referrerEmail || !referrerPhoneNumber || !referrerCompany || !relationshipWithReferee || !refereeName || !refereeEmail || !refereePhoneNumber || !refereeCompany) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newReferral = await prisma.referral.create({
      data: { referrerName, referrerEmail, referrerPhoneNumber, referrerCompany, relationshipWithReferee, refereeName, refereeEmail, refereePhoneNumber, refereeCompany }
    });
    await sendReferralEmail(newReferral);
    console.log("email sent successfully")
    res.status(201).json(newReferral);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
