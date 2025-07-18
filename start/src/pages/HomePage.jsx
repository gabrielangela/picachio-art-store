import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate('/auth/login'); 
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div>
        <p>Halo, {user?.email || 'Guest'}!</p>
        <p>Ada Konten</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
