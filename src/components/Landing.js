import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaMoneyCheckAlt, FaShieldAlt, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Landing.css';
import logo from '../assets/logo.jpg';
import real2 from '../assets/Real2.jpg';
import real3 from '../assets/Real3.jpg';
import real4 from '../assets/Real4.jpg';

const features = [
  {
    icon: <FaCheckCircle color="#2563eb" size={28} />,
    title: "Verified Listings",
    desc: "Scam-free property listings"
  },
  {
    icon: <FaMoneyCheckAlt color="#2563eb" size={28} />,
    title: "Direct Transactions",
    desc: "Connect directly with owners"
  },
  {
    icon: <FaShieldAlt color="#2563eb" size={28} />,
    title: "Ownership Verification",
    desc: "Fraud-proof property validation"
  },
  {
    icon: <FaTools color="#2563eb" size={28} />,
    title: "Service Providers",
    desc: "Registered maintenance technicians"
  }
];

const properties = [
  {
    img: real2,
    address: "120 Maple St",
    beds: "3 Beds - 2 Baths"
  },
  {
    img: real3,
    address: "436 Oak Ave",
    beds: "4 Beds - 3 Baths"
  },
  {
    img: real4,
    address: "788 Pine Rd",
    beds: "3 Beds - 2.5 Baths"
  }
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header className="header">
        <div className="logo-row">
          <img src={logo} alt="logo" className="logo-img" />
          <div className="logo">ITT Real Estate</div>
        </div>
        <motion.button
          className="get-started-button"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/signin")}
        >
          Get Started
        </motion.button>
      </header>
      <main className="main">
        <div className="left">
          <h1 className="title">
            Transforming Real Estate<br />with <span>AI & Blockchain</span>
          </h1>
          <p className="subtitle">
            Eliminate fraud, inefficiencies, and distrust. The platform connects property owners, buyers, tenants, technicians, and government bodies.
          </p>
          <div className="features">
            <div className="features-title">Platform Features</div>
            {features.map((f, i) => (
              <div key={i} className="feature">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-text">
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right">
          <div className="properties-title">Featured Verified Properties</div>
          <div className="property-list">
            {properties.map((p, i) => (
              <div key={i} className="property-card">
                <img src={p.img} alt="house" className="property-img" />
                <div className="property-info">
                  <div className="verified">Verified</div>
                  <div className="address">{p.address}</div>
                  <div className="beds">{p.beds}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="footer">
        Izzy Tech Real Estate, All rights reserved 2025.
      </footer>
    </div>
  );
}

export default Landing; 