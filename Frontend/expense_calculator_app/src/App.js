import Login from './Login.js';
import Signup from './Signup.js';
import Navbar from './Navbar';
import HomePage from './HomePage';
import Content1 from './content1.js';
import ResetPassword from './ResetPassword.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <Router>
      <ToastContainer
         position="top-right"
          autoClose={5000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/content1" element={<Content1 />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        {/* <Route path="/ResetPassword" element={<ResetPassword/>} /> */}
      </Routes>

    </Router>
  );
}

export default App;
