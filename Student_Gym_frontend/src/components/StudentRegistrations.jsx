import React, { useState } from 'react';
import axios from 'axios';
import './StudentRegistrations.css';

const StudentRegistrations = () => {
  const [formData, setFormData] = useState({ start: '', end: '' });
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post('/api/getRegistrations', formData);
      setRegistrations(response.data);
      setError('');
    } catch (err) {
      setError('Error while fetching registrations. Please try again.');
      setRegistrations([]);
    }
  };

  return (
    <div className="registrations-container">
      <div className="registrations-box">
        <form onSubmit={handleSubmit}>
          <h2>Student Registrations</h2>
          <div className="form-group">
            <label>
              Start Date:
              <input
                type="date"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              End Date:
              <input
                type="date"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">Get Registrations</button>
        </form>
        {error && <p className="error">{error}</p>}
        {registrations.length > 0 && (
          <table className="registrations-table">
            <thead>
              <tr>
                <th>USN</th>
                <th>Name</th>
                <th>Batch ID</th>
                <th>Date</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration, index) => (
                <tr key={index}>
                  <td>{registration.usn}</td>
                  <td>{registration.name}</td>
                  <td>{registration.batch_id}</td>
                  <td>{registration.month}</td>
                  <td>{registration.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrations;
