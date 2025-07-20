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
      <main className="bg-pink-50 min-h-screen px-6 py-10 font-sans">
        <Outlet />
      </main>
    </>
  );
}
