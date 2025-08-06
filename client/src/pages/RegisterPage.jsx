import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';
import { initializeUserDocument } from '../utils/userUtils';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      
      // Initialize user document with displayName and default role 'client'
      await initializeUserDocument(user.uid, {
        email: form.email,
        displayName: form.displayName,
        role: 'client'
      });
      
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#cad2c5] to-[#84a98c] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f9fdfb] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#84a98c]"
      >
        <h1 className="text-3xl font-bold text-center text-[#354f52] mb-6">
          Picachio.
        </h1>

        <input
          name="displayName"
          type="text"
          placeholder="Full Name"
          value={form.displayName}
          onChange={handleChange}
          className="w-full border border-[#cad2c5] rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-[#cad2c5] rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#52796f]"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-[#cad2c5] rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#52796f]"
        />

        <button
          type="submit"
          className="w-full bg-[#354f52] hover:bg-[#2f3e46] text-white py-2 rounded font-bold transition"
        >
          REGISTER
        </button>

        <p className="text-center mt-4 text-sm text-[#52796f]">
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="text-[#2f3e46] font-semibold hover:underline"
          >
            Login Now
          </a>
        </p>
      </form>
    </div>
  );
}
