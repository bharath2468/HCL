import React from 'react';
import authService from '../services/authService';
import '../styles/HospitalDetails.css'

const HospitalDetails = ()=>{
    const user = authService.getCurrentUser();
    return (
        <div className='hospital-detail'>
            <h3>Hospital Detail</h3>
            <p><b>Name</b> : {user ? user.name : 'Guest'}</p>
            <p><b>Address</b> : {user ? user.address : 'Guest'}</p>
            <p><b>Email</b>: {user ? user.email : 'Guest'}</p>
            <p><b>Contact</b>: {user ? user.contact : 'Guest'}</p>
        </div>
    );
};
export default HospitalDetails;