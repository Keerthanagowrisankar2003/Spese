const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router4 = express.Router();

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

router4.use(bodyParser.json());
router4.use(cors());
const secretKey = 'your_secret_key';
// Endpoint to get expenses for a user based on the JWT token
const GetExpense = async (req, res) => {
  const token = extractToken(req); 
  try {
    // Validate the token and get the userId
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;
    // Fetch expenses from the user's expense table
    const [expenses] = await pool.promise().query(
      `SELECT e.*, c.category FROM expense_${userId} e
       LEFT JOIN expense_category_${userId} c ON e.categoryid = c.categoryid`
    );
    // Send the response in the expected format
    res.status(200).json({ expense: expenses });
    return;
  } catch (error) {
    console.error('Error adding or fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { router4, GetExpense };
