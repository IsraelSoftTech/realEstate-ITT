import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = () => {
  const [showProgressBar, setShowProgressBar] = useState(false);
  const text = "ITT REAL ESTATE";
  const letters = text.split('');

  useEffect(() => {
    // Show progress bar after letters have fallen
    const timer = setTimeout(() => {
      setShowProgressBar(true);
    }, 500); // Reduced from 1000ms to 500ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="loader-container">
      <div className="loader-text">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="falling-letter"
            style={{
              animationDelay: `${index * 0.05}s` // Reduced from 0.1s to 0.05s
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      {showProgressBar && (
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      )}
    </div>
  );
};

export default Loader; 