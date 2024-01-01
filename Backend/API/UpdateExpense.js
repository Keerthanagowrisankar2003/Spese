const express = require('express'); //node framework
const router5 = express.Router();//node router 
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


router5.use(bodyParser.json());
router5.use(cors());
const secretKey = 'your_secret_key';

const UpdateExpense = async(expense_id,item,date,amount,req,res) => {
 // const expense_id = req.body.expense_id;
  token = req.header('Authorization').replace('Bearer ', ''); 
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;

    pool.query(
      `UPDATE expense_${userId} SET item = ?, date = ?, amount = ? WHERE expense_id = ?`,
      [item, date, amount, expense_id],
      (error, results) => {
        if (error) {
          console.error('Error updating expense:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(200).json({ message: 'Expense updated successfully' });
         
        }
      }
    );
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { router5, UpdateExpense };
