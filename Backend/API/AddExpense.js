const express = require('express');//node framework
const router3 = express.Router();//node router 
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

router3.use(bodyParser.json());
router3.use(cors());

const secretKey = 'your_secret_key';

const AddExpense = async (item, date, amount, category,req,res) => {
  token = req.header('Authorization').replace('Bearer ', ''); // Retrieve the token from headers
 
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;
   
   

    // Check if the category exists in the category table
    const [categoryResult] = await pool.promise().query(
      `SELECT * FROM expense_category_${userId} WHERE category = ?`,
      [category]
    );

    let categoryId;
   

    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].categoryid;
    } else {

      const [insertResult] = await pool.promise().query(
        `INSERT INTO expense_category_${userId} (userid,category) VALUES (?,?)`,
        [userId,category]
      );
     
      categoryId = insertResult.insertId;
    }

    // Insert expense into the expense table with the correct userId
    await pool.promise().query(
      `INSERT INTO expense_${userId} (userid, item, date, amount, categoryid) VALUES (?, ?, ?, ?, ?)`,
      [userId, item, date, amount, categoryId]
    );

    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { router3, AddExpense };