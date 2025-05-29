import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Signin from './Auth/Signin';
import Signup from './Auth/Signup';
import AdminDash from './components/AdminDash';
import TenantDash from './components/TenantDash';
import LordDash from './components/LordDash';
import TechDash from './components/TechDash';
import Users from './components/Users';
import AdminProp from './components/AdminProp';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', Arial, sans-serif;
    background: #fdf8f6;
    color: #222;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/properties" element={<AdminProp />} />
        <Route path="/tenant" element={<TenantDash />} />
        <Route path="/landlord" element={<LordDash />} />
        <Route path="/technician" element={<TechDash />} />
      </Routes>
    </Router>
  );
}

export default App;
