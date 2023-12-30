const express = require('express');
const router4 = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'server_database',
  connectionLimit: 10,
});

router4.use(bodyParser.json());
router4.use(cors());

const secretKey = 'your_secret_key';

// Endpoint to get expenses for a user based on the JWT token
const GetExpense = async (req, res) => {
  token = req.header('Authorization').replace('Bearer ', '');

  try {
    // Validate the token and get the userId
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;

    // Fetch expenses from the user's expense table
    const [expenses] = await pool.promise().query(
      `SELECT e.*, c.category FROM expense_${userId} e
       LEFT JOIN expense_category_${userId} c ON e.categoryid = c.categoryid`
    );

    // Your logic to add a new expense goes here...

    // Send the response in the expected format
    res.status(200).json({ expense: expenses });
    return;
  } catch (error) {
    console.error('Error adding or fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { router4, GetExpense };
