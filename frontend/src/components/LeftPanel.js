import React from 'react';
import '../styles/LeftPanel.css'

function LeftPanel(){
return(
    <div className='panel' >
        <p className='head'>Menu</p>
        <hr></hr>
        <p className='text'><a href=''>Dashboard</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Appointment</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Billing & Payments</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Prescriptions</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>History records</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Scan reports</a><p className='arrow'>&#x3E;</p></p>
        <p className='text'><a href=''>Complaints</a><p className='arrow'>&#x3E;</p></p>

    </div>
)
}
export default LeftPanel;