import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebase';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/'); // redirect ke home kalau SUDAH login
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <header>Admin Side</header>
      <Outlet />
    </>
  );
}