const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router6 = express.Router();//node router 

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

router6.use(bodyParser.json());
router6.use(cors());
const secretKey = 'your_secret_key';
const DeleteExpense = ( req,res,expense_id) => {
  const token = extractToken(req); 
    try {
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userid;
      // Perform the deletion in the database
      pool.query(
        `DELETE FROM expense_${userId} WHERE expense_id = ?`,
        [expense_id],
        (error, results) => {
          if (error) {
            console.error('Error deleting expense:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            res.status(200).json({ message: 'Expense deleted successfully' });
           
          }
        }
      );
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  module.exports = { router6, DeleteExpense };