import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-rose-600 mb-6">briellicious.</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-6"
        />
        <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded font-bold">
          REGISTER
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-rose-600 font-semibold">
            Login Now
          </a>
        </p>
      </form>
    </div>
  );
}