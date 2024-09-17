// Example API functions in availability.js
const API_URL = 'http://localhost:5000'
export const getDoctorAvailability = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/api/doctors/${doctorId}/availability`);
    if (!response.ok) {
      throw new Error('Failed to fetch doctor availability');
    }
    const data = await response.json();
    return data;  // Assuming the API returns an object with date strings as keys and arrays of time slots as values
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return {};
  }
};

export const getAvailableDoctors = async () => {
  try {
    // Use backticks for template literals
    const response = await fetch(`${API_URL}/api/doctors/get`);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error('Failed to fetch available doctors');
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the data, assumed to be an array of doctor objects
    return data;
  } catch (error) {
    // Log and handle errors
    console.error('Error fetching available doctors:', error);
    return [];  // Return an empty array or handle the error as needed
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_URL}/api/patients/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    if (!response.ok) {
      throw new Error('Failed to create new patient');
    }
    const data = await response.json();
    return !response.ok;  // Assuming the API returns the newly created patient object (including the ID)
  } catch (error) {
    console.error('Error creating new patient:', error);
    return null;
  }
};

export const getPatient = async () => {
  try {
    console.log("1")
    const response = await fetch(`${API_URL}/api/patients/get`);
    console.log("2")
    if (!response.ok) {
      throw new Error('Failed to Get new patient');
    }
    const data = await response.json();
    console.log(data)
    return data;  // Assuming the API returns the newly created patient object (including the ID)
  } catch (error) {
    console.error('Error Getting new patient:', error);
    return null;
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    console.log('Booking appointment with data:', appointmentData);
    const response = await fetch(`${API_URL}/api/appointments/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    // Log the response text

    console.log(response)
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to book appointment: ${errorData.message || 'Unknown error'}`);
    }
    const data = await response.json();
    console.log('Appointment booked successfully:', data);
    return true;
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { success: false, message: error.message };
  }
};
