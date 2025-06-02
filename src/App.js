import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Signin from './Auth/Signin';
import Signup from './Auth/Signup';
import AdminDash from './components/AdminDash';
import TenantDash from './components/TenantDash';
import LordDash from './components/LordDash';
import TechDash from './components/TechDash';
import Users from './components/Users';
import AdminProp from './components/AdminProp';
import AdminTransac from './components/AdminTransac';
import AdminGov from './components/AdminGov';
import LandProp from './components/LandProp';
import LandInquire from './components/LandInquire';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', Arial, sans-serif;
    background: #fdf8f6;
    color: #222;
  }
`;

// Wrapper component to handle navigation state
const NavigationWrapper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Updated to 2 seconds

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/properties" element={<AdminProp />} />
        <Route path="/admin/transactions" element={<AdminTransac />} />
        <Route path="/admin/government" element={<AdminGov />} />
        
        {/* Landlord Routes */}
        <Route path="/landlord" element={<LordDash />} />
        <Route path="/landlord/properties" element={<LandProp />} />
        <Route path="/landlord/inquiries" element={<LandInquire />} />
        
        {/* Other Dashboard Routes */}
        <Route path="/tenant" element={<TenantDash />} />
        <Route path="/technician" element={<TechDash />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/landlord" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyle />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <NavigationWrapper />
      </AuthProvider>
    </Router>
  );
}

export default App;
