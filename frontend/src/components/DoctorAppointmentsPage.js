import React, { useState } from 'react';
import DoctorAppointments from './DoctorAppointments';
import AppointmentDetails from './AppointmentDetails';

// doctorId should be passed from your auth context or parent component
const DoctorAppointmentsPage = ({ doctorId }) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  return (
    <div>
      {!selectedAppointmentId ? (
        <DoctorAppointments doctorId={doctorId} onSelectAppointment={setSelectedAppointmentId} />
      ) : (
        <AppointmentDetails appointmentId={selectedAppointmentId} />
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
