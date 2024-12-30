import React, { useState } from 'react';
import axios from 'axios';
import { UserData } from './context.jsx';

const Register = () => {
    const { setUser ,setRole} = UserData()
    const [formData, setFormData] = useState({
        usn:'',
        name: '',
        address: '',
        email: '',
        number:'',
        password: '',
    });

    const handleChange = (e) => {
        
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/registeruser', formData);
            alert('Registration successful');
            setRole(response)
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <form onSubmit={handleSubmit}>
                    <h2>Signup</h2>
                    <div className="form-group">
                        <label>
                            Usn:
                            <input type="text" name="usn" onChange={handleChange} required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Name:
                            <input type="text" name="name" onChange={handleChange} required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Address:
                            <input type="text" name="address" onChange={handleChange} required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Email:
                            <input type="email" name="email" onChange={handleChange} required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Number:
                            <input type="text" name="number" onChange={handleChange} required />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Password:
                            <input type="password" name="password" onChange={handleChange} required />
                        </label>
                    </div>
                    <button type="submit" className="submit-btn">Register</button>

                    <p>Already have an account? <a href="/login">Login</a></p>
                </form>
            </div>
        </div >
    );
};

export default Register;
