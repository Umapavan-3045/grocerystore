import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwtDecode
import Login from './loginpage';
import Home from './home';
import Cart from './cart';
import Profile from './profile';
import './App.css';
import Userlist from './userlist';
import SplashScreen from './splashscreen'; // Import your splash screen component

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State for handling splash screen

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // Show splash screen for 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  let decodedToken = {};
  
  if (token) {
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding failed:", error);
    }
  }

  const isLoggedIn = !!token;
  const loginType = decodedToken.loginType || '';

  // Conditional rendering based on the loading state
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className='App'>
      <nav>
        <img src={'assest/grocery.gif'} className='icon' alt='website logo' />
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to={loginType === "admin" ? "/queries" : "/cart"}>{loginType === "admin" ? "Queries" : "Cart"}</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to={loginType === "admin" ? "/new-orders" : "/contact"}>{loginType === "admin" ? "New Orders" : "Contact Us"}</Link></li>
          {loginType === "admin" && <li><Link to="/userslist">Userlist</Link></li>}
          <li><Link to="/profile">Profile</Link></li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout}>Logout</button></li>
          ) : (
            <li><Link to="/login">Login/Signup</Link></li>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userslist" element={<Userlist />} />
      </Routes>
    </div>
  );
}

export default App;
