import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-rose-600 mb-4">Welcome to briellicious.</h1>
      <p className="text-gray-600 mb-6">You're logged in as {user?.email || 'Guest'}</p>
      <button
        onClick={handleLogout}
        className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded shadow"
      >
        LOGOUT
      </button>
    </div>
  );
}