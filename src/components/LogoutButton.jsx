import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';

const StyledButton = styled.button`

 
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color:rgb(235, 100, 37);
  border: 1px solid #2563eb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1001; /* Above header */

  &:hover {
    background: #2563eb;
    color: #fff;
  }

  svg {
    font-size: 1rem;
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
      <FaSignOutAlt /> Logout
    </StyledButton>
  );
}

export default LogoutButton; 