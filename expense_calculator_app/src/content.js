import React, { Component } from 'react';
import './content.scss';
import logo from './images/logo.png';

class content extends Component {
  state = {
    tasks: [],
    newItem: '',
    newDate: '', // Initialize with today's date
    newAmount: '',
    newCategory: '',
    isModalOpen: false,
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'newDate') {
      this.setState({ [name]: value });
    } else {
      this.setState({ [name]: value });
    }
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  addTask = () => {
    const { newItem, newDate, newAmount, newCategory } = this.state;

    if (newItem.trim() === '' || newDate === '' || newAmount.trim() === '' || newCategory.trim() === '') return;

    const newTask = {
      item: newItem,
      date: newDate,
      amount: newAmount,
      category: newCategory,
    };

    this.setState((prevState) => ({
      tasks: [...prevState.tasks, newTask],
      newItem: '',
      newAmount: '',
      newCategory: '',
      isModalOpen: false,
    }));
  };

  removeTask = (index) => {
    const tasks = [...this.state.tasks];
    tasks.splice(index, 1);
    this.setState({ tasks });
  };

  render () {
  return (
    <nav id="navbar1">
       <div className="app-container">
          {/* <button className="add-button" onClick={this.openModal}>
            Add Item
          </button> */}
          <br></br>
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
          
        </div>
      <ul>
        <li onClick={this.openModal}><i className="fas fa-plus"></i> Add</li>
       
        <li><i className="fas fa-th"></i> Grid</li>
        <li><i className="fas fa-undo"></i> Undo</li>
        <li><i className="fas fa-share"></i> Share</li>
        <li className="dropdown">
          <span><i className="fas fa-download"></i> Export</span>
          <ul className="dropdown-content">
            <li>Export as CSV</li><br></br>
            <li>Export as CSV With schema</li><br></br>
            <li>Export to Power BI</li><br></br>
          </ul>
        </li>
        <li className="dropdown">
          <span><i className="fas fa-book"></i> Rules</span>
          <ul className="dropdown-content">
            <li> Add Rules</li><br></br>
            <li>Manage Rules</li>
          </ul>
        </li>

        <li className="dropdown">
          <span><i className="fas fa-ellipsis-h"></i></span>
          <ul className="dropdown-content">
            <li>{/* <i className="fas fa-bell"></i> */} Alert Me</li><br></br>
            <li> Manage my alerts </li>

          </ul>
        </li>
      </ul>
      <div className="navbar2">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className='right-content'>
       <li>
          <i className="fas fa-filter"></i> Filter
        </li>
        <li>
          <i className="fas fa-layer-group"></i> Group By
          </li>
        <li>
          <i className="fas fa-list"></i> All Items
          </li>  
        
      </ul>
    
     <br></br>
      
        <ul>
          <li className="dropdown">
            <span><i className="fas fa-calendar-alt"></i> Date</span>
            <ul className="dropdown-content">
              <li>Older to Newer</li><br></br>
              <li>Newer to Older</li><br></br>
              <li>Filter By</li><br></br>
              <li>Group By Date</li><br></br>
              <li>Column Settings</li><br></br>
              <li>Totals</li>
            </ul>
          </li>
          <li className="dropdown">
            <span><i className="fas fa-tags"></i> Category</span>
            <ul className="dropdown-content">
              <li>A to Z</li><br></br>
              <li>Z to A</li><br></br>
              <li>Filter By</li><br></br>
              <li>Group by Category</li><br></br>
              <li>Column Settings</li><br></br>
              <li>Totals</li>
            </ul>
          </li>
          
          <span><i className="fas fa-file-alt"></i> Description</span>
          <ul className="dropdown-content">
            <li className="dropdown">
              <span>Columns Settings</span>
              <ul className="dropdown-content">
                <li>Edit</li><br></br>
                <li>Hide this column</li><br></br>
                <li>Format this column</li><br></br>
                <li>Show/Hide columns</li><br></br>
                <li>Widen column</li><br></br>
                <li>Narrow column</li><br></br>
                <li>Add a column</li><br></br>
              </ul>
            </li>
          </ul>
     
       
          <li><i className="fas fa-user"></i>Created By</li>
        
          <li><i className="fas fa-columns"></i>Add Column</li>
         
        </ul>
        </div>
        <table className="task-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.item}</td>
                  <td>{task.date}</td>
                  <td>{task.amount}</td>
                  <td>{task.category}</td>
                  <td>
                    <button
                      className="remove-button"
                      onClick={() => this.removeTask(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         
    </nav>
  );
}}

export default content;
