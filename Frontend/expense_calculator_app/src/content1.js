import React, { Component } from 'react';
import './content1.scss';
import Navbar from './Navbar';
                                               
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

  render() {
    return (
      <>
        <Navbar />
        <div className="app-container">
          <button className="add-button" onClick={this.openModal}>
            Add Item
          </button>
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
        </div>
      </>
    );
  }
}

export default content;
