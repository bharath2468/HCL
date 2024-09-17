import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateDoctor.css'

const AddDoctorForm = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    contactNumber: '',
    email: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST request to your API endpoint
      const response = await axios.post('http://localhost:5000/api/doctors/create', formData);

      if (response.status === 201) {
        alert('Doctor added successfully!');
        // Optionally, clear the form or redirect the user
        setFormData({
          firstName: '',
          lastName: '',
          specialization: '',
          contactNumber: '',
          email: ''
        });
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Error adding doctor. Please try again.');
    }
  };

  return (
    <div className="add-doctor-form">
      <h2>Add New Doctor</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="specialization">Specialization:</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctorForm;
