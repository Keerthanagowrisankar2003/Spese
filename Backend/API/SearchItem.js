const express = require('express');
const router7 = express.Router();
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

router7.use(bodyParser.json());
router7.use(cors());
const secretKey = 'your_secret_key';

// Search endpoint
const SearchItem = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userid;
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
  
      const searchQuery = req.body.searchQuery; // Assuming the search query is sent in the request body
  
      if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required.' });
      }
  
      pool.query(
        `SELECT * FROM expense_${userId}  e
        LEFT JOIN expense_category_${userId} c ON e.categoryid = c.categoryid WHERE item LIKE ?`,
        [`%${searchQuery}%`],
        (error, results) => {
          if (error) {
            console.error('Error searching expense:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json({ expense: results, message: 'item searched successfully' });
          }
        }
      );
    } catch (error) {
      console.error('Error searching expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { router7, SearchItem };
  