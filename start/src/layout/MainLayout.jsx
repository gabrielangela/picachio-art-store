import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../configs/firebase';

export default function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth/login');
      }
    });

    // cleanup listener saat komponen unmount
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/contact">Contact</Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}