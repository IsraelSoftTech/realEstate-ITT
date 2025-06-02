import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #fff;
  color: rgb(235, 100, 37);
  border: 1px solid #2563eb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1001;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 40px;
  min-width: 100px;
  
  &:hover {
    background: #2563eb;
    color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    min-height: 44px; /* Larger touch target on mobile */
    font-size: 1rem;
    
    svg {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    min-width: 44px;
    border-radius: 50%;
    
    span {
      display: none; /* Hide text on very small screens */
    }
    
    svg {
      margin: 0;
      font-size: 1.2rem;
    }
  }
`;

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/signin');
  };

  return (
    <StyledButton onClick={handleLogout}>
      <FaSignOutAlt /> <span>Logout</span>
    </StyledButton>
  );
}

export default LogoutButton; 