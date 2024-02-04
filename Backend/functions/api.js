const express = require('express');//node framework
const serverless = require('serverless-http');
const { router1, login} = require('./Login');
const { router3, AddExpense} = require('./AddExpense');
const { router2, Signup} = require('./Signup');
const { router4, GetExpense} = require('./GetExpense');
const { router5, UpdateExpense} = require('./UpdateExpense');
const { router6, DeleteExpense} = require('./DeleteExpense');
const { router7, SearchItem} = require('./SearchItem');
const { router8, SendMail } = require('./SendMail');
const { router9, ResetPassword } = require('./ResetPassword');
const app = express();
const PORT = 3000;
//login
app.use('/.netlify/functions/login', router1);
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginUser = await login (email, password,res);
   // res.status(200).json({ message: login });
  } 
  catch (error) {
   // res.status(401).json({ error }\
    return 
  }
});
//Signup
app.use('/.netlify/functions/Signup', router2);
app.post('/Signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const SignupUser = await Signup (firstname, lastname,email, password,res); 
  }
   catch (error) {
    return 
  }
});
//Addexpense
app.use('/.netlify/functions/AddExpense', router3);
app.post('/AddExpense', async (req, res) => {
  const {item, date, amount, category } = req.body;
  try {
    const UserExpense = await AddExpense (item, date, amount, category,req,res);
  } 
  catch (error) {
    return 
  }
});
//Getexpense
app.use('/.netlify/functions/GetExpense', router4);
app.post('/GetExpense',  async (req, res) => {
  try {
    const GetExpenses = await GetExpense (req,res);
   
  } 
  catch (error) {
    return 
  }
});
//Updateexpense
app.use('/.netlify/functions/UpdateExpense', router5);
app.post('/UpdateExpense',  async (req, res) => {
  const {expense_id,item, date, amount } = req.body;
  try {
    const UpdateExpenses = await UpdateExpense (expense_id,item, date, amount,req,res);
   
  } 
  catch (error) {
    return 
  }
});
//DeleteExpense
app.use('/.netlify/functions/DeleteExpense', router6);
app.post('/DeleteExpense',  async (req, res) => {
  const {expense_id } = req.body;
  try {
    const DeleteExpenses = await DeleteExpense (req,res,expense_id);
  }
  catch (error) {
    return 
  }
});
//Search Item
app.use('/.netlify/functions/SearchItem', router7);
app.post('/SearchItem',  async (req, res) => {
  const {searchQuery } = req.body;
  try {
    const SearchItems = await SearchItem (req,res,searchQuery);
   
  }
   catch (error) { 
    return 
  }
});
//sendMail
app.use('/.netlify/functions/SendMail', router8);
app.post('/SendMail',  async (req, res) => {
  const {userEmail } = req.body;
  try {
    const SearchItems = await SendMail (req,res,userEmail);
   
  } 
  catch (error) {
    return 
  }
});
//Reset Password
app.use('/.netlify/functions/ResetPassword', router9);
app.post('/ResetPassword', async(req, res) => {
  const { email, newPassword } = req.body;
  try {
    const SearchItems = await  ResetPassword(email, newPassword,req, res);
   
  }
   catch (error) {
    return 
  }
//server connection confirmation message  
});
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports.handler = serverless(app);