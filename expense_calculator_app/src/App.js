import Login from './Login.js';
import Signup from './Signup.js';
import Navbar from './Navbar';
import Content from './content';
import Content1 from './content1.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/content" element={<Content />} />
        <Route path="/content1" element={<Content1 />} />
      </Routes>

    </Router>
  );
}

export default App;
