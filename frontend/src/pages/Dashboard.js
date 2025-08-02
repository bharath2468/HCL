import React, {useState, useCallback} from 'react';
import { useLocation } from 'react-router-dom';
import authService from '../services/authService';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import HospitalDetails from '../components/HospitalDetails';
import Appointment from '../components/Appoinment';
import AddDoctorForm from '../components/CreateDoctor';
import AddPatient from '../components/CreatePatient';
import PatientHistory from '../components/PatientHistory';
import DoctorAppointments from '../components/DoctorAppointments';
import DoctorAppointmentsPage from '../components/DoctorAppointmentsPage';
import '../styles/Dashboard.css'

const Dashboard = () => {
  const location = useLocation();
  const { state } = location || {};
  const { role } = state || {};
  const doctorId = role === 'doctor' ? authService.getCurrentDoctor()?._id : null;
  console.log('Dashboard doctorId:', doctorId);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true); // State to track LeftPanel visibility
  const [iscontent, setcontent] = useState("dashboard");
  const handleSelection = useCallback((selectedContent) => {
    console.log('Dashboard content selected:', selectedContent);
    setcontent(selectedContent);
  }, []);
  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen); // Toggle LeftPanel visibility
  };
  let content;
  if (iscontent === "dashboard"){
    content = <HospitalDetails role={role}/>;
  } else if(iscontent === "appointment"){
    content = <Appointment />
  } else if(iscontent === "doctor"){
    content = <AddDoctorForm />
  } else if(iscontent === "patient"){
    content = <AddPatient />
  } else if(iscontent === "patienthistory"){
    content = <PatientHistory />
  } else if(iscontent === "doctorappointments" && doctorId) {
    content = <DoctorAppointmentsPage doctorId={doctorId} />;
  }
  return (
    <div className={`dashboard-container ${isLeftPanelOpen ? 'left-panel-open' : 'left-panel-closed'}`}>
      <Header toggleLeftPanel={toggleLeftPanel}/>
      {isLeftPanelOpen && <LeftPanel selected={handleSelection} role={role} />}
      <div className='dashboard-content'>
      {content}
      </div>
    </div>
  );
};

export default Dashboard;
