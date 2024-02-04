import React, { useState, useEffect } from 'react';
import './HomePage.scss';
import logo from './images/logo.png';
import axiosInstance from './axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link} from 'react-router-dom';

const HomePage = () => {
  
  const [tasks, setTasks] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [IsShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [shareStartDate, setShareStartDate] = useState('');
  const [shareEndDate, setShareEndDate] = useState('');

  useEffect(() => {
    getExpenses();
  }, []);
  //sort
  const handleSort = (columnName) => {
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

    setTasks(sortedTasks);
    setSortColumn(columnName);
    setSortDirection(direction);
  };
 



//calcukate monthly expense

const calculateTotalExpenseForCurrentMonth = () => {
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


 
  
  
const handleInputChange = async (event) => {
  const { name, value } = event.target;
  switch (name) {
    case 'newItem':
      setNewItem(value);
      break;
    case 'newDate':
      setNewDate(value);
      break;
    case 'newAmount':
      setNewAmount(value);
      break;
    case 'newCategory':
      setNewCategory(value);
      break;
    case 'searchQuery':
      setSearchQuery(value);
      break;
    default:
      break;
  }

  // Trigger search when the user types in the search input
  if (name === 'searchQuery') {
    await searchExpenses();
  }
};

  // Method to open the Share modal
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  // Method to close the Share modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    // Clear the input fields when closing the modal
    setShareStartDate('');
    setShareEndDate('');
  };


  //share 
  const handleShare = async () => {
    // Check if both start and end dates are provided
    if (!shareStartDate || !shareEndDate) {
      toast.error('Please enter valid start and end dates', {
        theme: "colored",
      });
      return;
    }
  
    try {
      // Convert start and end dates to Date objects
      const startDateObj = new Date(shareStartDate);
      const endDateObj = new Date(shareEndDate);
  
      // Set time part of startDateObj to midnight
      startDateObj.setHours(0, 0, 0, 0);
  
      // Set time part of endDateObj to just before midnight
      endDateObj.setHours(23, 59, 59, 999);
  
      // Filter tasks based on the date range
      const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.date);
        return taskDate >= startDateObj && taskDate <= endDateObj;
      });
  
      // Generate and save PDF for the filtered tasks
      await generateAndSavePDF(filteredTasks);
  
      toast.success('PDF generated and saved successfully!', {
        theme: "light",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', {
        theme: "colored",
      });
    }
  };
  
  
  const generateAndSavePDF = async (tasks) => {
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
        theme: "colored",
        });
      // alert('Failed to generate PDF');
    }
  };
  


  //searchItem
  
  const searchExpenses = async () => {
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
          setTasks(responseData.expense);
        } else {
          console.error('Invalid response format. Expected "expense" array.');
        }
      }
    } catch (error) {
      console.error('Error searching expenses:', error);
    }
  };

  // Method to fetch expenses
  const getExpenses = async () => {
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
          setTasks(responseData.expense);
          setUniqueCategories(uniqueCategories);
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

  const getCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    return formattedDate;
  };



  const openModal = () => {
    setIsModalOpen(true);
    setNewDate(getCurrentDate());
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addTask = async () => {
    // Check if the amount is a valid non-negative number
    if (isNaN(newAmount) || parseFloat(newAmount) < 0) {
      toast.error('Invalid amount type', {
        theme: "colored",
      });
      return;
    }

    if (newItem.trim() === '' || newDate === '' || newAmount.trim() === '' || newCategory.trim() === '') {
      toast.error('All fields must be filled', {
        theme: "colored",
      });
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(newDate);

    // Check if the selected date is in the future
    if (selectedDate > currentDate) {
      toast.error('Future date is not allowed', {
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
          theme: "light",
        });
        // Update the tasks state with the new task
        setTasks((prevTasks) => [...prevTasks, newTask]);
        // Reset the input fields and close the modal
        setNewItem('');
        setNewDate('');
        setNewAmount('');
        setNewCategory('');
        setIsModalOpen(false);
      } else {
       
        toast.error('Failed to add item', {
          theme: "colored",
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item', {
        theme: "colored",
      });
    }
  };

  const openUpdateModal = (index) => {
    const locale = navigator.language || navigator.userLanguage; // Get the user's preferred language
    console.log('Current Locale:', locale);
    console.log('Selected index:', index);
    const selectedTask = tasks[index];
    const localDate = new Date(selectedTask.date).toLocaleDateString('en-CA'); // 'en-CA' (English - Canada) "dd-MMM-yyyy," 
    // Set state variables for the update modal
    setIsUpdateModalOpen(true);
    setSelectedTaskIndex(index);
    setNewItem(selectedTask.item);
    setNewDate(localDate);
    setNewAmount(selectedTask.amount);
    setNewCategory(selectedTask.category);
  };
  // Method to close the update modal
  const closeUpdateModal = () => {
    // Close the update modal and reset related state variables
    setIsUpdateModalOpen(false);
    setSelectedTaskIndex(null);
    setNewItem('');
    setNewAmount('');
    setNewCategory('');
  };

  // Method to handle the update of a task
  const updateTask = async () => {
    try {
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
            theme: "light",
          });

          // Fetch updated data from the server
          await getExpenses();

          // Reset the form and close the update modal
          setNewItem('');
          setNewAmount('');
          setNewCategory('');
          setIsUpdateModalOpen(false);
        } else {
          toast.error('Failed to update', {
            theme: "colored",
          });

          // alert('Failed to update');
        }
      } else {
        console.error(`Invalid index or _id at index ${selectedTaskIndex}`);
        toast.error('Failed to update item', {
          theme: "colored",
        });

        // alert('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item', {
        theme: "colored",
      });

      // alert('Failed to update item');
    }
  };
  
  
  

  const removeTask = async (index) => {
    const expense_id = tasks[index].expense_id;  // Assuming each task has a unique identifier (_id)

    const deleteTask = {
      expense_id: expense_id,
    };

    try {
      // Send a DELETE request to the server's DeleteExpense endpoint
      const response = await axiosInstance.post('/DeleteExpense', deleteTask);

      if (response.status === 200) {
        toast.success('Item removed successfully', {
          theme: "light",
        });

        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
      } else {
        toast.error('Failed to remove item', {
          theme: "colored",
        });
        // alert('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item', {
        theme: "colored",
      });
      // alert('Failed to remove item');
    }
  };

  //filter task
  const handleCategoryFilter = (category) => {
    // Toggle the selection status of the category
    const updatedSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((selectedCategory) => selectedCategory !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedSelectedCategories);
  };

  // Method to apply selected filters and update displayed tasks
  const applyCategoryFilters = () => {
    // If no categories selected, display all tasks
    if (selectedCategories.length === 0) {
      getExpenses(); // Assuming getExpenses is a function to fetch all tasks
      return;
    }

    // Filter tasks based on selected categories
    const filteredTasks = tasks.filter((task) =>
      selectedCategories.includes(task.category)
    );

    setTasks(filteredTasks);
  };
  
  const totalExpenseForCurrentMonth = calculateTotalExpenseForCurrentMonth();

  // render() {
  //   const totalExpenseForCurrentMonth = this.calculateTotalExpenseForCurrentMonth(this.state.tasks || []);
  //   const { sortColumn, sortDirection, tasks } = this.state;
  //   const { uniqueCategories, selectedCategories } = this.state;
  
  return (
    <nav id="navbar1">
      <div className="app-container">
        <br />
  
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <div className="task-input">
                <input
                  type="text"
                  placeholder="Item"
                  name="newItem"
                  value={newItem}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  placeholder="Date"
                  name="newDate"
                  value={newDate}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Amount"
                  name="newAmount"
                  value={newAmount}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Category"
                  name="newCategory"
                  value={newCategory}
                  onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>
                  Add item
                </button>
              </div>
            </div>
          </div>
        )}
         {IsShareModalOpen && (
          <div className="modal update-modal">
            <span className="close" onClick={closeShareModal}>
              &times;
            </span>
            <div className="task-input">
              <input
                type="date"
                placeholder="Start Date"
                name="startDate"
                value={shareStartDate}
                onChange={(e) => setShareStartDate(e.target.value)}
              />
              <input
                type="date"
                placeholder="End Date"
                name="endDate"
                value={shareEndDate}
                onChange={(e) => setShareEndDate(e.target.value)}
              />
              <button className="update-button" onClick={handleShare}>
                Submit
              </button>
            </div>
          </div>
        )}
  
        {isUpdateModalOpen && (
          <div className="modal update-modal">
            <span className="close" onClick={closeUpdateModal}>
              &times;
            </span>
            <div className="task-input">
              <input
                type="text"
                placeholder="Item"
                name="newItem"
                value={newItem}
                onChange={handleInputChange}
              />
              <input
                type="date"
                placeholder="Date"
                name="newDate"
                value={newDate}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Amount"
                name="newAmount"
                value={newAmount}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Category"
                name="newCategory"
                value={newCategory}
                onChange={handleInputChange}
              />
              <button className="update-button" onClick={updateTask}>
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
          <li onClick={openModal}>
            <i className="fas fa-plus"></i> Add
          </li>
        </ul>
  
        <div className="search-input">
          <input
            type="text"
            placeholder="Search..."
            name="searchQuery"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
  
        <ul className="right-content">
          <li className="dropdown">
              <i className="fas fa-filter"></i> Filter
              <ul className="dropdown-content checkbox-list">
                {uniqueCategories.map((category) => (
                  <li key={category}>
                    <label>
                      <input
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryFilter(category)}
                      />
                      {category}
                    </label>
                  </li>
                ))}
                <li onClick={applyCategoryFilters}>
                  <button className="apply-filter-button">Apply Filters</button>
                </li>
              </ul>
            </li>
            <li onClick={openShareModal}>
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
              <th className="header-cell" onClick={() => handleSort('item')}>
                Item <i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell" onClick={() => handleSort('date')}>
                Date<i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell" onClick={() => handleSort('amount')}>
                Amount <i className={`fa fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
              </th>
              <th className="header-cell" onClick={() => handleSort('category')}>
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
            onClick={() =>removeTask(index)}
          >
            Remove
          </button>
          <button className="update-button" onClick={() => openUpdateModal(index)}> Update</button>
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


  export default HomePage;