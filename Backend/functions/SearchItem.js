const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router7 = express.Router();

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

router7.use(bodyParser.json());
router7.use(cors());
const secretKey = 'your_secret_key';
// Search endpoint
const SearchItem = async (req, res) => {
  const token = extractToken(req); 
  
    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userid;
  
      if (userId==null) {
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
  