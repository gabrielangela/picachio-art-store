import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log("User registered:", userCredential.user);
      navigate('/'); 
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration error:", errorCode, errorMessage);
    }
  };

  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Username:</label>
          <br />
          <input 
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">Email:</label>
          <br />
          <input 
          type="text"
          name="email"
          value={form.email}
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">Password:</label>
          <br />
          <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}