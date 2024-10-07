import React from 'react';
import authService from '../services/authService';
import '../styles/HospitalDetails.css'

const HospitalDetails = ({role})=>{
    const user = authService.getCurrentUser();
    const doctor = authService.getCurrentDoctor();
    let isdoctor = false;
    console.log(role)
    if (role==='doctor'){
        isdoctor = true;
    }
    return (
        <div>
        <h2>Dashboard</h2>
        <div className='hospital-detail'>
            <h3>Hospital Detail</h3>
            <p><b>Name</b> : {user ? user.name : 'Guest'}</p>
            <p><b>Address</b> : {user ? user.address : 'Guest'}</p>
            <p><b>Email</b>: {user ? user.email : 'Guest'}</p>
            <p><b>Contact</b>: {user ? user.contact : 'Guest'}</p>
        </div>
        {isdoctor ? <div className='hospital-detail'>
            <h3>Doctor Detail</h3>
            <p><b>FirstName</b> : {user ? doctor.firstname : 'Guest'}</p>
            <p><b>lastName</b> : {user ? doctor.lastname : 'Guest'}</p>
            <p><b>Email</b>: {user ? doctor.email : 'Guest'}</p>
            <p><b>Contact</b>: {user ? doctor.contact : 'Guest'}</p>
        </div>: <></>}
        </div>
    );
};
export default HospitalDetails;