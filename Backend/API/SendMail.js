const express = require('express');
const router8 = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

router8.use(bodyParser.json());
router8.use(cors());
const secretKey = 'your_secret_key';

const SendMail = async (req, res) => {
  const { userEmail } = req.body;

  // Send email logic here
  const transporter = nodemailer.createTransport({
    // Your email service configuration
  });

  const mailOptions = {
    from: 'keerthanag.21cse@kongu.edu',
    to: userEmail,
    subject: 'Expense Alert',
    text: 'Your monthly expense has exceeded 10,000 rupees. Please review your expenses.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
};

module.exports = { router8, SendMail };
