const express = require('express');
const router2 = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'server_database',
  connectionLimit: 10,
});

router2.use(bodyParser.json());
router2.use(cors());

const Signup = async (firstname, lastname, email, password, res) => {
  pool.query(
    'SELECT * FROM user WHERE emailid = ?',
    [email],
    async (error, results) => {
      if (error) {
        console.error('Error checking existing user:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          res.status(409).json({ error: 'User already exists with this email' });
        } else {
          try {
            const hashedPassword = await bcrypt.hash(password, 10);

            pool.getConnection((getConnectionError, connection) => {
              if (getConnectionError) {
                console.error('Error getting connection:', getConnectionError);
                res.status(500).json({ error: 'Internal server error' });
                return;
              }

              connection.beginTransaction((beginError) => {
                if (beginError) {
                  console.error('Error beginning transaction:', beginError);
                  res.status(500).json({ error: 'Internal server error' });
                  connection.release();
                  return;
                }

                // Insert new user
                connection.query(
                  'INSERT INTO user (firstname, lastname, emailid, password) VALUES (?, ?, ?, ?)',
                  [firstname, lastname, email, hashedPassword],
                  (insertError, insertResults) => {
                    if (insertError) {
                      console.error('Error inserting user:', insertError);
                      connection.rollback(() => {
                        res.status(500).json({ error: 'Internal server error' });
                        connection.release();
                      });
                    } else {
                      const userId = insertResults.insertId;

                      // Create expense_category table for the new user
                      connection.query(
                        `CREATE TABLE IF NOT EXISTS expense_category_${userId} (
                          userid INT,
                          categoryid INT AUTO_INCREMENT PRIMARY KEY,
                          category VARCHAR(100),
                          FOREIGN KEY (userid) REFERENCES user(userid)                             
                        )`,
                        (createCategoryTableError) => {
                          if (createCategoryTableError) {
                            console.error('Error creating expense_category table:', createCategoryTableError);
                            connection.rollback(() => {
                              res.status(500).json({ error: 'Internal server error' });
                              connection.release();
                            });
                          } else {
                            // Now that expense_category table is created, create the expense table
                            connection.query(
                              `CREATE TABLE IF NOT EXISTS expense_${userId} (
                                userid INT,
                                expense_id INT AUTO_INCREMENT PRIMARY KEY,
                                item VARCHAR(100),
                                categoryid INT,
                                date DATE,
                                amount DECIMAL(10, 2),
                                FOREIGN KEY (userid) REFERENCES user(userid),
                                FOREIGN KEY (categoryid) REFERENCES expense_category_${userId}(categoryid)
                              )`,
                              (createExpenseTableError) => {
                                if (createExpenseTableError) {
                                  console.error('Error creating expense table:', createExpenseTableError);
                                  connection.rollback(() => {
                                    res.status(500).json({ error: 'Internal server error' });
                                    connection.release();
                                  });
                                } else {
                                  connection.commit((commitError) => {
                                    if (commitError) {
                                      console.error('Error committing transaction:', commitError);
                                      connection.rollback(() => {
                                        res.status(500).json({ error: 'Internal server error' });
                                        connection.release();
                                      });
                                    } else {
                                     
                                      res.status(200).json({ message: 'User signed up successfully' });
                                      connection.release();
                                    }
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              });
            });
          } catch (hashError) {
            console.error('Error hashing password:', hashError);
            res.status(500).json({ error: 'Internal server error' });
          }
        }
      }
    }
  );
};

module.exports = { router2, Signup };
