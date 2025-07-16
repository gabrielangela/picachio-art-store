import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

export default function LoginPage() {
  const [form, setForm] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log("User logged in:", userCredential.user);
      navigate('/'); // redirect ke halaman Home
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error:", errorCode, errorMessage);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="">Username / Email:</label>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}