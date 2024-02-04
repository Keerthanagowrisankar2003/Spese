const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router9 = express.Router();//node router 
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

router9.use(bodyParser.json());
router9.use(cors());
  // JWT secret key (replace with a secure key)
  const secretKey = 'your_secret_key';
const ResetPassword = async (email, newPassword,req, res) => {
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
  