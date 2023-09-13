# 🎯 ABOUT THE PROJECT:
- The Expenditure Calculator Project is a web-based application designed to help users track and manage their expenses efficiently. 
- It allows users to categorize their expenses and provides a user-friendly interface to input and view financial data. 
- The users can track the expenses on a particular category they have spent.They can also track the expense on a particular day,month and year.
- The users can also create group among themselves with their family or friends which helps to track the expenses of the total family throughout the particular period of time
- [ER DIAGRAM FOR THE EXPENDITURE CALCULATOR](https://github.com/Keerthanagowrisankar2003/Expenditure-calculator/blob/DOCS_readme/Expenditure%20calculator%20er.png)


This ER Diagram consists of the tables User,Income,Expense category,Expense,Membership and the group.
The user table consusts if the details of the user.
The income table consists of the Income details of a particular user like the source if the income,amount,and the date of recieving the income.
The expense category consists of the information the particular category the user have spent.
The expense table consists of the information of the expense spent by the user on the particular category with the date and the amount they have spent.
The membership the table which links the table group and the user.
The group table allows the users to create groups among the users.

- [API CALLS NEEEDED](https://github.com/Keerthanagowrisankar2003/Expenditure-calculator/blob/DOCS_readme/API%20CALLS%20NEEDED.docx)

These are the API Calls needed for our project.If the user sends the request to login ,if the email id and the password matches to the user table only the the user is able to login in.Similarly if the user sends a request to the expense on a particular date the user Id with which the user has logged in (user id in the user table) and the user Id in the expense table matches and the date that the user send and the date in the expense table matches the details will be fetched from the expense tabke and given to the user.Similarly for all the exoense categories and date,month and year.

![SignUp Mobile view](img/Signup%20mobile%20view.png)
https://github.com/Keerthanagowrisankar2003/Expenditure-calculator/blob/DOCS_readme/login%20mobile%20view.png
https://github.com/Keerthanagowrisankar2003/Expenditure-calculator/blob/DOCS_readme/login%20page%20desktop%20view.png
https://github.com/Keerthanagowrisankar2003/Expenditure-calculator/blob/DOCS_readme/signup%20page%20desktop%20view%20.png

These are the design for the desktop and moblie view signup and login pages where the user can create only one account with one email id .This will be checked at the time of signup .The user will be entering the name,email id and the password . This will be sent to the database .If the email is already registerd alert message will be sent that only one account created by one email id (i.e. Account already exists)
similarly for login .At the time of login the email id entered should be already present in the databse and also the password should match with the entered password .If anyone of the creteria is not followed the user will get the alert message as (invalid username or password)


