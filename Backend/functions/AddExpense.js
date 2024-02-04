const { extractToken } = require('./ExtractJwtToken');
const importDependencies = require('./Imports');
const { express, bodyParser, cors, mysql, jwt } = importDependencies();
const router3 = express.Router();//node router 

const pool = mysql.createPool({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12675401',
  password: 'JppSA6RyfR',
  database: 'sql12675401',
  connectionLimit: 10,
});
router3.use(bodyParser.json());
router3.use(cors());
const secretKey = 'your_secret_key';
const AddExpense = async (item, date, amount, category,req,res) => {
  const token = extractToken(req); 
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userid;
    // Check if the category exists in the category table
    const [categoryResult] = await pool.promise().query(
      `SELECT * FROM expense_category_${userId} WHERE category = ?`,
      [category]
    );
    let categoryId;
    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].categoryid;
    } else {
      const [insertResult] = await pool.promise().query(
        `INSERT INTO expense_category_${userId} (userid,category) VALUES (?,?)`,
        [userId,category]
      );
      categoryId = insertResult.insertId;
    }
    // Insert expense into the expense table with the correct userId
    await pool.promise().query(
      `INSERT INTO expense_${userId} (userid, item, date, amount, categoryid) VALUES (?, ?, ?, ?, ?)`,
      [userId, item, date, amount, categoryId]
    );
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { router3, AddExpense };