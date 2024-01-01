import React, { Component } from 'react';
import './HomePage.scss';
import logo from './images/logo.png';
import axiosInstance from './axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link,useNavigate } from 'react-router-dom';


class HomePage extends Component {
  
 
    state = {
      tasks: [],
      newItem: '',
      newDate: '',
      newAmount: '',
      newCategory: '',
      isModalOpen: false,
      uniqueCategories: [],
      selectedCategories: [], 
      isUpdateModalOpen: false,
      searchQuery: '',
      sortColumn: null,
      sortDirection: 'asc', // 'asc' for ascending, 'desc' for descending
    };
 componentDidMount() {
   
    this.getExpenses();
    // this.getExpenses();
   
  }
  //sort
  handleSort = (columnName) => {
    const { sortColumn, sortDirection, tasks } = this.state;
  
    // Toggle the sort direction if the same column is clicked again
    const direction = columnName === sortColumn ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
  
    // Use a sorting function based on the column name and direction
    const sortedTasks = [...tasks].sort((a, b) => {
      if (columnName === 'amount') {
        // Convert 'amount' values to numbers for proper sorting
        const amountA = parseFloat(a[columnName]);
        const amountB = parseFloat(b[columnName]);
  
        return direction === 'asc' ? amountA - amountB : amountB - amountA;
      } else {
        // For other columns, perform lexicographical sorting
        return direction === 'asc' ? a[columnName].localeCompare(b[columnName]) : b[columnName].localeCompare(a[columnName]);
      }
    });
  
    this.setState({
      tasks: sortedTasks,
      sortColumn: columnName,
      sortDirection: direction,
    });
  };
  
 



//calcukate monthly expense

calculateTotalExpenseForCurrentMonth = () => {
  const { tasks } = this.state;

  // Check if tasks is an array and has elements
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return "0.00";
  }

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const currentYear = currentDate.getFullYear();

  // Filter tasks for the current month and year
  const currentMonthTasks = tasks.filter((task) => {
    return (
      task &&
      task.date &&
      new Date(task.date).getMonth() + 1 === currentMonth &&
      new Date(task.date).getFullYear() === currentYear
    );
  });

  // Calculate the total expense for the current month
  const totalExpense = currentMonthTasks.reduce(
    (total, task) => total + parseFloat(task.amount),
    0
  );

  return totalExpense.toFixed(2);
};


 
  
  
  handleInputChange =async (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === 'searchQuery') {
      // Trigger search when the user types in the search input
      await this.searchExpenses();
    }

  };
  //share 
  // Add this method to your HomePage component
handleShare = async () => {
  const fromDate = prompt('Enter From Date (YYYY-MM-DD):');
  const toDate = prompt('Enter To Date (YYYY-MM-DD):');

  if (!fromDate || !toDate) {
    toast.error('Please enter valid date range', {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // alert('Please enter valid date range');
    return;
  }

  try {
    // Convert fromDate and toDate to Date objects
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Filter tasks based on the date range
    const filteredTasks = this.state.tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= fromDateObj && taskDate <= toDateObj;
    });

    // Generate and save PDF for the filtered tasks
    await this.generateAndSavePDF(filteredTasks);

    // alert('PDF generated and saved successfully!');
    toast.success('PDF generated and saved  successfully!', {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF', {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // alert('Failed to generate PDF');
  }
};
generateAndSavePDF = async (tasks) => {
  try {
    const pdf = new jsPDF();

    // Set up the PDF content
    const tableData = tasks.map((task) => [task.item, new Date(task.date).toLocaleDateString(), task.amount, task.category]);
    pdf.text('Expense Report', 14, 10);

    pdf.autoTable({
     
      head: [['Item', 'Date', 'Amount', 'Category']],
      body: tableData,
    });

    // Save the PDF file
    pdf.save('expense_report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF', {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
    // alert('Failed to generate PDF');
  }
};




  //searchItem
  
  searchExpenses = async () => {
    const { searchQuery } = this.state;
  
    const query = {
      searchQuery: searchQuery,
    };
  
    try {
      const response = await axiosInstance.post('/SearchItem', query);
  
      console.log('Search API Response:', response);
  
      if (response.status === 200) {
        const responseData = response.data;
  
        console.log('Response Data:', responseData);
  
        // Check if the response data has the expected structure
        if (responseData && Array.isArray(responseData.expense)) {
          // Update the state with the new expense array
          this.setState({
            tasks: responseData.expense,
          });
        } else {
          console.error('Invalid response format. Expected "expense" array.');
        }
      }
    } catch (error) {
      console.error('Error searching expenses:', error);
    }
  };
  

  // Method to fetch expenses
  getExpenses = async () => {
    try {
      const response = await axiosInstance.post('/GetExpense');
      console.log('Response data:', response.data);
  
      if (response.status === 200) {
        const responseData = response.data;
        console.log('Response Data:', responseData);
  
        if (responseData && Array.isArray(responseData.expense)) {
          const uniqueCategories = Array.from(
            new Set(responseData.expense.map((expenseItem) => expenseItem.category))
          );
          this.setState({
            tasks: responseData.expense,
            uniqueCategories: uniqueCategories,
          });
        } else {
          console.error('Invalid response format. Expected "expense" array.');
        }
      } else {
        console.error('Failed to fetch expenses');
       
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // alert('Session expired.Please Login');
    }
  };
  getCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    return formattedDate;
  };


  openModal = () => {
    this.setState({
      isModalOpen: true,
      // newDate: this.getCurrentDate(),
    });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  addTask = async () => {
    const { newItem, newDate, newAmount, newCategory } = this.state;
  
    // Check if the amount is a valid non-negative number
    if (isNaN(newAmount) /*checks whether number */|| parseFloat(newAmount) < 0) {
      toast.error('Invalid amount type', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      // alert('Invalid amount type');
      return;
    }
  
    if (newItem.trim() === '' || newDate === '' || newAmount.trim() === '' || newCategory.trim() === '') {
      toast.error('All fields must be filled', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      // alert('All fields must be filled');
      return;
    }
    const currentDate = new Date();
  const selectedDate = new Date(newDate);

  // Check if the selected date is in the future
  if (selectedDate > currentDate) {
    // Display an error message
    toast.error('Future date is not allowed', {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    return;
  }
  
    const newTask = {
      item: newItem,
      date: newDate,
      amount: newAmount,
      category: newCategory,
    };
    
    try {
      // Send a POST request to the server's AddExpense endpoint
      const response = await axiosInstance.post('/AddExpense', newTask);

      if (response.status === 201) {
        toast.success('Item added successfully', {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        this.setState((prevState) => ({
          tasks: [...prevState.tasks, newTask],
          newItem: '',
          newAmount: '',
          newCategory: '',
          isModalOpen: false,
        }));
      } else {
        toast.error('Failed to add item', {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        // alert('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      // alert('Failed to add item');
    }
  };
  openUpdateModal = (index) => {
    const locale = navigator.language || navigator.userLanguage; // Get the user's preferred language
    console.log('Current Locale:', locale);
    console.log('Selected index:', index);
    const selectedTask = this.state.tasks[index];
    const localDate = new Date(selectedTask.date).toLocaleDateString('en-CA'); //  'en-CA' (English - Canada) "dd-MMM-yyyy," 
    this.setState({
      isUpdateModalOpen: true,
      selectedTaskIndex: index,
      newItem: selectedTask.item,
      newDate: localDate,
      newAmount: selectedTask.amount,
      newCategory: selectedTask.category,
    });
  };

  // Method to close the update modal
  closeUpdateModal = () => {
    this.setState({
      isUpdateModalOpen: false,
      selectedTaskIndex: null,
      newItem: '',
      newAmount: '',
      newCategory: '',
    });
  };

  // Method to handle the update of a task
  updateTask = async () => {
    try {
      const { newItem, newDate, newAmount, newCategory, selectedTaskIndex, tasks } = this.state;
  
      // Check if newItem, newAmount, and newCategory are defined before calling trim
      if (!newItem || !newAmount || !newCategory) {
        console.error('Invalid input values');
        return;
      }
  
      const trimmedItem = newItem.trim();
      const trimmedAmount = newAmount.trim();
      const trimmedCategory = newCategory.trim();
  
      if (trimmedItem === '' || newDate === '' || trimmedAmount === '' || trimmedCategory === '') {
        console.error('One or more input values are empty');
        return;
      }
  
      // Check if the tasks array and the element at the specified index are defined
      if (selectedTaskIndex !== null && selectedTaskIndex >= 0 && selectedTaskIndex < tasks.length) {
        const expense_id = tasks[selectedTaskIndex].expense_id;
  
        const updatedTask = {
          expense_id: expense_id, // Include the expense_id in the request
          item: trimmedItem,
          date: newDate,
          amount: trimmedAmount,
          category: trimmedCategory, // Include the category in the request
        };
  
        // Send a POST request to the server's UpdateExpense endpoint
        const response = await axiosInstance.post('/UpdateExpense', updatedTask);
  
        if (response.status === 200) {
          toast.success('Item updated successfully', {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
  
          // Fetch updated data from the server
          await this.getExpenses();
  
          // Reset the form and close the update modal
          this.setState({
            newItem: '',
            newAmount: '',
            newCategory: '',
            isUpdateModalOpen: false,
          });
        } else {
          toast.error('Failed to update', {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          
          // alert('Failed to update');
        }
      } else {
        console.error(`Invalid index or _id at index ${selectedTaskIndex}`);
        toast.error('Failed to update item', {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        
        // alert('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      
      // alert('Failed to update item');
    }
  };
  
  
  

  removeTask = async (index) => {
    const { tasks } = this.state;
    const expense_id = tasks[index].expense_id;  // Assuming each task has a unique identifier (_id)

    const DeleteTask = {
      expense_id: expense_id, 
     
    };

    try {
      // Send a DELETE request to the server's DeleteExpense endpoint
      const response = await axiosInstance.post('/DeleteExpense', DeleteTask);

      if (response.status === 200) {
        toast.success('Item removed successfully', {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          limit:3,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        const updatedTasks = [...this.state.tasks];
        updatedTasks.splice(index, 1);
        this.setState({ tasks: updatedTasks });
      } else {
        toast.error('Failed to remove item', {
          position: "top-center",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        // alert('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      // alert('Failed to remove item');
    }
  };

  //filter task
  handleCategoryFilter = (category) => {
    const { selectedCategories } = this.state;
  
    // Toggle the selection status of the category
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((selectedCategory) => selectedCategory !== category)
      : [...selectedCategories, category];
  
    this.setState({
      selectedCategories: updatedSelectedCategories,
    });
  };
  
  // Method to apply selected filters and update displayed tasks
  applyCategoryFilters = () => {
    const { tasks, selectedCategories } = this.state;
  
    // If no categories selected, display all tasks
    if (selectedCategories.length === 0) {
      this.getExpenses();
      return;
    }
  
    // Filter tasks based on selected categories
    const filteredTasks = tasks.filter((task) =>
      selectedCategories.includes(task.category)
    );
  
    this.setState({
      tasks: filteredTasks,
    });
  };
 

  render() {
    const totalExpenseForCurrentMonth = this.calculateTotalExpenseForCurrentMonth(this.state.tasks || []);
    const { sortColumn, sortDirection, tasks } = this.state;
    const { uniqueCategories, selectedCategories } = this.state;
  
    return (
      <nav id="navbar1">
        <div className="app-container">
          <br />
  
          {this.state.isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={this.closeModal}>
                  &times;
                </span>
                <div className="task-input">
                  <input
                    type="text"
                    placeholder="Item"
                    name="newItem"
                    value={this.state.newItem}
                    onChange={this.handleInputChange}
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    name="newDate"
                    value={this.state.newDate}
                    onChange={this.handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="Amount"
                    name="newAmount"
                    value={this.state.newAmount}
                    onChange={this.handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    name="newCategory"
                    value={this.state.newCategory}
                    onChange={this.handleInputChange}
                  />
                  <button className="add-button" onClick={this.addTask}>
                    Add item
                  </button>
                </div>
              </div>
            </div>
          )}
  
          {this.state.isUpdateModalOpen && (
            <div className="modal update-modal">
              <span className="close" onClick={this.closeUpdateModal}>
                &times;
              </span>
              <div className="task-input">
                <input
                  type="text"
                  placeholder="Item"
                  name="newItem"
                  value={this.state.newItem}
                  onChange={this.handleInputChange}
                />
                <input
                  type="date"
                  placeholder="Date"
                  name="newDate"
                  value={this.state.newDate}
                  onChange={this.handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Amount"
                  name="newAmount"
                  value={this.state.newAmount}
                  onChange={this.handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Category"
                  name="newCategory"
                  value={this.state.newCategory}
                  onChange={this.handleInputChange}
                />
                <button className="update-button" onClick={this.updateTask}>
                  Update item
                </button>
              </div>
            </div>
          )}
  
        </div>
  
        <div className="navbar2">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
  
          <ul>
            <li onClick={this.openModal}>
              <i className="fas fa-plus"></i> Add
            </li>
          </ul>
  
          <div className="search-input">
            <input
              type="text"
              placeholder="Search..."
              name="searchQuery"
              value={this.state.searchQuery}
              onChange={this.handleInputChange}
            />
          </div>
  
          <ul className="right-content">
            <li className="dropdown">
              <i className="fas fa-filter"> Filter</i>
              <ul className="dropdown-content checkbox-list">
                {uniqueCategories.map((category) => (
                  <li key={category}>
                    <label>
                      <input
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => this.handleCategoryFilter(category)}
                      />
                      {category}
                    </label>
                  </li>
                ))}
                <li onClick={this.applyCategoryFilters}>
                  <button className="apply-filter-button">Apply Filters</button>
                </li>
              </ul>
            </li>
            <li onClick={this.handleShare}>
              <i className="fas fa-share"></i> Share
            </li>
            <li className="dropdown" >
    <i className="fas fa-sign-out-alt"></i> <Link to="/"> Logout</Link>
  </li>
          </ul>
  
          <div className="total-expense">
            <span>You Spent<span className="expense"> Rs.{totalExpenseForCurrentMonth} </span>for this month </span>
          </div>
  
          <br />
  
        </div>
  
        <table className="task-table">
          <thead>
            <tr>
              <th className="header-cell" onClick={() => this.handleSort('item')}>
                Item <i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell" onClick={() => this.handleSort('date')}>
                Date<i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell" onClick={() => this.handleSort('amount')}>
                Amount <i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell" onClick={() => this.handleSort('category')}>
                Category <i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell">Action</th>
            </tr>
          </thead>
          <tbody>
  {tasks?.length > 0 ? (
    tasks.map((task, index) => (
      <tr key={index}>
        <td>{task && task.item}</td>
        <td>{task && new Date(task.date).toLocaleDateString()}</td>
        <td>{task && task.amount}</td>
        <td>{task && task.category}</td>
        <td>
          <button
            className="remove-button"
            onClick={() => this.removeTask(index)}
          >
            Remove
          </button>
          <button className="update-button" onClick={() => this.openUpdateModal(index)}> Update</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">No tasks available</td>
    </tr>
  )}
</tbody>

        </table>
  
      </nav>
    );
  }
  }

  export default HomePage;