const bcrypt = require('bcrypt');//password encryption
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router1 = express.Router();//node router 

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

router1.use(bodyParser.json());
router1.use(cors());
// JWT secret key (replace with a secure key)
const secretKey = 'your_secret_key';
const login = async (email, password, res) => {
  try {
    const [results] = await pool.promise().query('SELECT * FROM user WHERE emailid = ?', [email]);

    if (results.length > 0) {
      const hashedPassword = results[0].password;

      try {
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
          const token = jwt.sign({ userid: results[0].userid, email: results[0].emailid }, secretKey, { expiresIn: '1h' });
          res.status(200).json({ message: 'Login successful', token });
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
      } catch (compareError) {
        console.error('Error comparing passwords:', compareError);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(401).json({ error: 'User does not exist' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = { router1, login };  
 
