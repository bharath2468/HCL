import React from 'react';
import '../styles/Header.css'
import authService from '../services/authService';

const Header = ({ toggleLeftPanel }) => {
    const onLogout = () => {
        authService.logout();
        window.location.href = '/';
      };

    return (
      <div className='main-header'>
        <div class="hamburger" id="hamburger" onClick={toggleLeftPanel}>
            &#9776;
        </div>
        <h2>Hospital Record System</h2>
        <a className='a' href="#">About</a>
        <a className='a' href="#">About</a>
        <a className='a' href="#">About</a>
        <a className='a' href="#">About</a>
        <a className='a' href="#">About</a>
        <a className='a' href="#">About</a>
        <a className='a' href="#">About</a>
        
        <button className='contact'>Contact US &#9743;</button>
        <button onClick={onLogout} className='logout'>Logout</button>
        
      </div>
    );
  };
  
  export default Header;