import React from 'react';
import './content.css';
import logo from './images/logo.png';

const Navbar = () => {
  return (
    <nav id="navbar1">
      <ul>
        <li><i className="fas fa-plus"></i> Add</li>
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


      <br></br>
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
    </div>
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
          <li className="dropdown">
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
        </li>
          <li><i className="fas fa-user"></i>Created By</li>
        
          <li><i className="fas fa-columns"></i>Add Column</li>
        </ul>
    </nav>
  );
}

export default Navbar;
