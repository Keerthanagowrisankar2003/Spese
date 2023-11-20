const express = require('express');//node framework
const bodyParser = require('body-parser');//middleware
const cors = require('cors');//connection between two different servers
const mysql = require('mysql2');//database
const bcrypt = require('bcrypt');//encryption of data

const app = express();
const port = 3002;//fixed port

//connection to mysql
const pool = mysql.createPool({
  host: 'localhost',
  user: 'server_database',
  password: 'Keerthanag@2003',
  database: 'server_database',
  connectionLimit: 10,
});

app.use(bodyParser.json());
app.use(cors()); 
// Handle POST requests to the /signup endpoint
app.post('/Signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Check if the email already exists
  pool.query(
    'SELECT * FROM user WHERE emailid = ?',
    [email],
    async (error, results, fields) => {
      if (error) {
        console.error('Error checking existing user:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          // Email already exists, return an error
          res.status(409).json({ error: 'User already exists with this email' });
        } else {
          // Email doesn't exist, proceed with the insertion

          try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);//10-cost factor(no.of time the hashing algorithm is done)

            pool.query(
              'INSERT INTO user (firstname, lastname, emailid, password) VALUES (?, ?, ?, ?)',
              [firstname, lastname, email, hashedPassword],
              (insertError, insertResults, insertFields) => {
                if (insertError) {
                  console.error('Error inserting user:', insertError);
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  console.log('User inserted:', insertResults);
                  res.status(200).json({ message: 'User signed up successfully' });
                }
              }
            );
          } catch (hashError) {
            console.error('Error hashing password:', hashError);
            res.status(500).json({ error: 'Internal server error' });
          }
        }
      }
    }
  );
});
// Add this endpoint for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  pool.query(
    'SELECT * FROM user WHERE emailid = ?',
    [email],
    async (error, results, fields) => {
      if (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          // User found, compare hashed password
          const hashedPassword = results[0].password;

          try {
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (passwordMatch) {
              // Passwords match, login successful
              res.status(200).json({ message: 'Login successful' });
            } else {
              // Passwords don't match, incorrect password
              res.status(401).json({ error: 'Incorrect password' });
            }
          } catch (compareError) {
            console.error('Error comparing passwords:', compareError);
            res.status(500).json({ error: 'Internal server error' });
          }
        } else {
          // No user found, user does not exist
          res.status(401).json({ error: 'User does not exist' });
        }
      }
    }
  );
});

// Handle GET requests to the root
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
