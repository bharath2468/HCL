import React, {useState} from 'react';
import authService from '../services/authService';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
//import '../styles/Dashboard.css'

const Dashboard = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false); // State to track LeftPanel visibility
  const user = JSON.parse(localStorage.getItem('user'));

  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen); // Toggle LeftPanel visibility
  };

  return (
    <div className={`dashboard-container ${isLeftPanelOpen ? 'left-panel-open' : 'left-panel-closed'}`}>
      <Header toggleLeftPanel={toggleLeftPanel}/>
      {isLeftPanelOpen && <LeftPanel />}
      <div className='dashboard-content'>
      <h2>Dashboard</h2>
      <p>Welcome, {user ? user.name : 'Guest'}</p>
      </div>
    </div>
  );
};

export default Dashboard;
