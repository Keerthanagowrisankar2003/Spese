import React, { Component } from 'react';
import './content1.css';

class content1 extends Component {
  state = {
    tasks: [],
    newTask: '',
  };

  handleInputChange = (e) => {
    this.setState({ newTask: e.target.value });
  };

  addTask = () => {
    if (this.state.newTask.trim() === '') return;
    this.setState((prevState) => ({
      tasks: [...prevState.tasks, this.state.newTask],
      newTask: '',
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
      <div className="app-container">
        {/* <h1 className="app-title">+</h1> */}
        <div className="task-input">
          <input
            type="text"
            value={this.state.newTask}
            onChange={this.handleInputChange}
          />
          <button className="add-button" onClick={this.addTask}>
            Add item
          </button>
        </div>
        <ul className="task-list">
          {this.state.tasks.map((task, index) => (
            <li key={index} className="task-item">
              {task}
              <button
                className="remove-button"
                onClick={() => this.removeTask(index)}
              >
                <br></br>
                remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      </>
    );
  }
}

export default content1;
