const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router5 = express.Router();//node router 

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});

router5.use(bodyParser.json());
router5.use(cors());
const secretKey = 'your_secret_key';
const UpdateExpense = async(expense_id,item,date,amount,req,res) => {
 // const expense_id = req.body.expense_id;
 const token = extractToken(req); 
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;
    pool.query(
      `UPDATE expense_${userId} SET item = ?, date = ?, amount = ? WHERE expense_id = ?`,
      [item, date, amount, expense_id],
      (error, results) => {
        if (error) {
          console.error('Error updating expense:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(200).json({ message: 'Expense updated successfully' });
         
        }
      }
    );
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { router5, UpdateExpense };
