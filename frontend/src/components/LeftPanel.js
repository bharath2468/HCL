import React from 'react';
import '../styles/LeftPanel.css'

function LeftPanel({selected}, {role}){
    const handleClick = (content) => (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        selected(content);
      };
    let isdoctor = false;
    if (role==='doctor'){
        isdoctor = true;
    }
return(
    <div>
        {isdoctor ? 
        <div className='panel' >
        <p className='head'>Menu</p>
        <hr></hr>
        <p className='text'><a href='' onClick={handleClick("dashboard")}>Dashboard</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href='' onClick={handleClick("patient")}>Add Patient</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href='' onClick={handleClick("doctor")}>Add Doctor</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href='' onClick={handleClick("appointment")}>Book Appointment</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Billing & Payments</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>History records</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Scan reports</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Complaints</a><p className='arrow'>&#x3E;</p></p>
    </div>:
        <div className='panel' >
        <p className='head'>Menu</p>
        <hr></hr>
        <p className='text'><a href='' onClick={handleClick("dashboard")}>Dashboard</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href='' onClick={handleClick("patient")}>Patient Details</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href='' onClick={handleClick("doctor")}>Doctor Details</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href='' onClick={handleClick("appointment")}>Appointment</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Billing & Payments</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>History records</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Scan reports</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Complaints</a><p className='arrow'>&#x3E;</p></p>
    </div>
    }
    </div>
)
}
export default LeftPanel;