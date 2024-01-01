// ResetPassword.jsx

import React, { useState } from 'react';
import axiosInstance from './axios';
import './ResetPassword.scss';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
;
const ResetPassword = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inputEmail, setInputEmail] = useState(email || ''); // Initialize with the provided email
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {

      // Log email and newPassword for debugging
      console.log('Email:', inputEmail); // Use inputEmail instead of email
      console.log('New Password:', newPassword);

      // Send a request to your server to update the password
      const response = await axiosInstance.post('/ResetPassword', { email: inputEmail, newPassword });

      if (response.status === 200) {
        // Password reset successful, you can redirect or display a success message
        console.log('Password reset successful');
        toast.success('Password Reset Sucessful!', {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            // Navigate to /HomePage after the toast is closed
            navigate('/');
          },
        });
      } else {
        console.error('Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div class="reset-password-wrapper">
 
    <div className="reset-password-container">
      <h3 className="reset-password-title">Reset Password</h3>
      <input
        className="reset-password-input"
        type="text" 
        placeholder="E-mail"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
      />
      <input
        className="reset-password-input"
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        className="reset-password-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button className="reset-password-button" onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
    </div>
  
  );
};

export default ResetPassword;
