import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebase';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-[#cad2c5] to-[#84a98c] min-h-screen px-6 py-10 font-sans">
        <Outlet />
      </main>
    </>
  );
}
