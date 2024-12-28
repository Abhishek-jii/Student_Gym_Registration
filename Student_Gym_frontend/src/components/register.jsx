import React, { useState } from 'react';
import axios from 'axios';
import { UserData } from './context';

const Register = () => {
    const { setUser } = UserData
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
            const response = await axios.post('https:localhost:8000/api/registeruser', formData);
            alert('Registration successful');
            setUser(response[0])
            alert("successful")
        } catch (err) {
            alert('Error during registration');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <label>
                Usn:
                <input type="text" name="usn" onChange={handleChange} required />
            </label>
            <label>
                Name:
                <input type="text" name="name" onChange={handleChange} required />
            </label>
            <label>
                Address:
                <input type="text" name="address" onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" onChange={handleChange} required />
            </label>
            
            <label>
                Number:
                <input type="text" name="Number" onChange={handleChange} required />
            </label>
            <label>
                Password:
                <input type="password" name="password" onChange={handleChange} required />
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
