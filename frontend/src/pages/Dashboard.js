import React, {useState} from 'react';
import authService from '../services/authService';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import HospitalDetails from '../components/HospitalDetails';
import '../styles/Dashboard.css'

const Dashboard = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false); // State to track LeftPanel visibility
  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen); // Toggle LeftPanel visibility
  };

  return (
    <div className={`dashboard-container ${isLeftPanelOpen ? 'left-panel-open' : 'left-panel-closed'}`}>
      <Header toggleLeftPanel={toggleLeftPanel}/>
      <div className='dashboard-content'>
      <h2>Dashboard</h2>
      <HospitalDetails />
      </div>
      {isLeftPanelOpen && <LeftPanel />}
    </div>
  );
};

export default Dashboard;
