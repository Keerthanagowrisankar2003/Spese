const express = require('express');//node framework
const router6 = express.Router();//node router 
const bodyParser = require('body-parser');
const cors = require('cors');//connect two different resources for data transfer
const mysql = require('mysql2');// import backend
const jwt = require('jsonwebtoken');//import jwt token

const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'server_database',
  connectionLimit: 10,
});


router6.use(bodyParser.json());
router6.use(cors());
const secretKey = 'your_secret_key';

const DeleteExpense = ( req,res,expense_id) => {
  
 
  token = req.header('Authorization').replace('Bearer ', ''); // Retrieve the token from headers
    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userid;
  
      // Perform the deletion in the database
      pool.query(
        `DELETE FROM expense_${userId} WHERE expense_id = ?`,
        [expense_id],
        (error, results) => {
          if (error) {
            console.error('Error deleting expense:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json({ message: 'Expense deleted successfully' });
           
          }
        }
      );
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  module.exports = { router6, DeleteExpense };