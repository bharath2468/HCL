import React, {useState, useCallback} from 'react';
import authService from '../services/authService';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import HospitalDetails from '../components/HospitalDetails';
import Appointment from '../components/Appoinment';
import '../styles/Dashboard.css'

const Dashboard = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true); // State to track LeftPanel visibility
  const [iscontent, setcontent] = useState("dashboard");
  const handleSelection = useCallback((selectedContent) => {
    setcontent(selectedContent);
  }, []);
  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen); // Toggle LeftPanel visibility
  };
  let content;
  if (iscontent === "dashboard"){
    content = <HospitalDetails />;
  } else if(iscontent === "appointment"){
    content = <Appointment />
  }
  console.log(iscontent)

  return (
    <div className={`dashboard-container ${isLeftPanelOpen ? 'left-panel-open' : 'left-panel-closed'}`}>
      <Header toggleLeftPanel={toggleLeftPanel}/>
      {isLeftPanelOpen && <LeftPanel selected={handleSelection} />}
      <div className='dashboard-content'>
      {content}
      </div>
    </div>
  );
};

export default Dashboard;
