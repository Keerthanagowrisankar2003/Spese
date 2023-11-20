import React, { useState } from 'react';
import './Login.scss';
import Authenticationimage from './images/Authentication.jpg';
import { Link} from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3002/login', { email, password });

      if (response.status === 200) {
        alert('Login successful');
       
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login unsucessfull');
    }
  };

  const validateForm = () => {
  // Check if the Email field is filled.
    if (email.length === 0) {
      alert('Email Address cannot be empty');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
     // Check if password follows constraints or not.
    if (password.length < 8) {
      alert('Password must contain at least 8 characters.');
      return;
    }
    // Count characters in the password.
    let countUpperCase = 0;
    let countLowerCase = 0;
    let countDigit = 0;
    let countSpecialCharacters = 0;

    for (let i = 0; i < password.length; i++) {
      const specialChars = [
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', 
        '+', '=', '[', '{', ']', '}', ':', ';', '<', '>', 
      ];

      if (specialChars.includes(password[i])) {
        countSpecialCharacters++;
      } else if (!isNaN(password[i] * 1)) {
        countDigit++;
      } else {
        if (password[i] === password[i].toUpperCase()) {
          countUpperCase++;
        }
        if (password[i] === password[i].toLowerCase()) {
          countLowerCase++;
        }
      }
    }

    if (countLowerCase === 0) {
      alert('There must be athleast 1 lowercase characters in password');
      return;
    }

    if (countUpperCase === 0) {
      alert('There must be athleast 1 uppercase characters in password');
      return;
    }

    if (countDigit === 0) {
      alert('There must be athleast 1 digit characters in password');
      return;
    }

    if (countSpecialCharacters === 0) {
      alert('There must be athleast 1 special characters in password');
      return;
    }

    alert('Form is valid');
    handleLogin();
  }

  return (
   
    
    <section className='image-container'>
      {/* Section for the image and header */}
      <section className="image">
        <h3 className="quote">Effortlessly track and<br /> manage your expense</h3>
          {/*Displaythe Image */}
        <img src={Authenticationimage} alt="exp" className="image" />
      </section>
       {/* Section for the form */}
      <section className='Authentication-page'>
        <section className='form'>
          <section className='form-input'>
             {/* Input field for Email */}
            <input 
              type='email'
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
             {/* Input field for Password */}
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             {/* Login button */}
            <button type="submit" onClick={validateForm}>Login</button>
            <a href="#"><span className="account">Forgot Password?</span></a>
            {/* Link for new users */}
            <Link to="/signup " >
                  Don't have an account? <span className="click-here">Click here</span>
            </Link>
          </section>
        </section>
      </section>
    </section>
   
  );
}

export default Login;