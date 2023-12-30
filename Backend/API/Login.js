const express = require('express');//node framework
const router1 = express.Router();//node router 
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

router1.use(bodyParser.json());
router1.use(cors());
// JWT secret key (replace with a secure key)
const secretKey = 'your_secret_key';

const login = async (email, password,res) => {

  pool.query(
    'SELECT * FROM user WHERE emailid = ?',
    [email],
    async (error, results) => {
      if (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
        return 

      } else {
        if (results.length > 0) {
          const hashedPassword = results[0].password;

          try {
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            //encrypt the password

            if (passwordMatch) {
              // Generate JWT token
              const token = jwt.sign({ userid: results[0].userid, email: results[0].emailid }, secretKey, { expiresIn: '1h' });

              //password check
              res.status(200).json({ message: 'Login successful',token });
              return
            } else {
              res.status(401).json({ error: 'Incorrect password' });
              return
            }
          } catch (compareError) {
            console.error('Error comparing passwords:', compareError);
            res.status(500).json({ error: 'Internal server error' });
            return
          }
        } else {
          res.status(401).json({ error: 'User does not exist' });
          return
        }
      }
    }
  );
};


module.exports = { router1, login };  
 
