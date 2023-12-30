import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav>
      <ul>
      <li><Link to="/search"><i className="fas fa-search"></i></Link></li>
      <li><Link to="/notifications"><i className="fas fa-bell"></i></Link></li>
      <li><Link to="/alarms"><i className="fas fa-clock"></i></Link></li>
      <li><Link to="/settings"><i className="fas fa-cogs"></i></Link></li>
      <li><Link to="/profile"><i className="fas fa-user"></i> </Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
