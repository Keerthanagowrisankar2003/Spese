const express = require('express');//node framework
const router9 = express.Router();//node router 
const bodyParser = require('body-parser');
const cors = require('cors');//connect two different resources for data transfer
const mysql = require('mysql2');// import backend
const bcrypt = require('bcrypt');//password encryption
const jwt = require('jsonwebtoken');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'server_database',
    password: 'Keerthanag@2003',
    database: 'server_database',
    connectionLimit: 10,
  });
  
router9.use(bodyParser.json());
router9.use(cors());
  // JWT secret key (replace with a secure key)
  const secretKey = 'your_secret_key';

const ResetPassword = async (email, newPassword,req, res) => {
    // You can add validation for the newPassword here
  
    try {
      // Hash the new password before updating it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password in the database
      pool.query(
        'UPDATE user SET password = ? WHERE emailid = ?',
        [hashedPassword, email],
        (error, results) => {
          
         
      
          if (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json({ message: 'Password updated successfully' });
          }
        }
      );
      
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { router9, ResetPassword };
  