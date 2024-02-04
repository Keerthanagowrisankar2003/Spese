const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router2 = express.Router();
const bcrypt = require('bcrypt');//password encryption

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

// Middleware setup for router2
router2.use(bodyParser.json());
router2.use(cors());

// Function to check if a user with the given email already exists
const checkExistingUser = async (email) => {
  const [results] = await pool.promise().query('SELECT * FROM user WHERE emailid = ?', [email]);
  return results.length > 0;
};

// Function to hash the given password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function to insert a new user into the database
const insertUser = async (connection, firstname, lastname, email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO user (firstname, lastname, emailid, password) VALUES (?, ?, ?, ?)',
      [firstname, lastname, email, hashedPassword],
      (insertError, insertResults) => {
        if (insertError) {
          reject(insertError);
        } else {
          resolve(insertResults.insertId);
        }
      }
    );
  });
};

// Function to create the expense_category table for a new user
const createExpenseCategoryTable = async (connection, userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS expense_category_${userId} (
        userid INT,
        categoryid INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100),
        FOREIGN KEY (userid) REFERENCES user(userid)                             
      )`,
      (createCategoryTableError) => {
        if (createCategoryTableError) {
          reject(createCategoryTableError);
        } else {
          resolve();
        }
      }
    );
  });
};

// Function to create the expense table for a new user
const createExpenseTable = async (connection, userId) => {
  return new Promise((resolve, reject) => {
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
          reject(createExpenseTableError);
        } else {
          resolve();
        }
      }
    );
  });
};

// Signup route handler
const Signup = async (firstname, lastname, email, password, res) => {
  try {
    // Check if the user with the given email already exists
    const userExists = await checkExistingUser(email);

    if (userExists) {
      res.status(409).json({ error: 'User already exists with this email' });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Acquire a connection from the pool and begin a transaction
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        console.error('Error getting connection:', getConnectionError);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      connection.beginTransaction(async (beginError) => {
        if (beginError) {
          console.error('Error beginning transaction:', beginError);
          res.status(500).json({ error: 'Internal server error' });
          connection.release();
          return;
        }

        try {
          // Insert user, create expense_category table, and create expense table
          const userId = await insertUser(connection, firstname, lastname, email, hashedPassword);

          await createExpenseCategoryTable(connection, userId);

          await createExpenseTable(connection, userId);

          // Commit the transaction
          connection.commit((commitError) => {
            if (commitError) {
              console.error('Error committing transaction:', commitError);
              connection.rollback(() => {
                res.status(500).json({ error: 'Internal server error' });
                connection.release();
              });
            } else {
              // Respond with success message
              res.status(200).json({ message: 'User signed up successfully' });
              connection.release();
            }
          });
        } catch (error) {
          // Handle errors during the transaction
          console.error('Error during transaction:', error);
          connection.rollback(() => {
            res.status(500).json({ error: 'Internal server error' });
            connection.release();
          });
        }
      });
    });
  } catch (error) {
    // Handle errors outside the transaction
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export router2 and Signup function
module.exports = { router2, Signup };
