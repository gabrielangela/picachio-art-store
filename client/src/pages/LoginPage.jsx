import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';
import { googleProvider } from '../configs/firebase';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
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
          LOGIN
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-[#cad2c5] hover:bg-[#84a98c] text-[#2f3e46] font-semibold w-full py-2 rounded mt-4"
        >
          Sign in with Google
        </button>

        <p className="text-center mt-4 text-sm text-[#52796f]">
          Don&apos;t have an account?{' '}
          <a
            href="/auth/register"
            className="text-[#2f3e46] font-semibold hover:underline"
          >
            Register Now
          </a>
        </p>
      </form>
    </div>
  );
}
