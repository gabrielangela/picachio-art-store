import { useAuth } from '../context/AuthContext';

export default function AboutPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>About Page</h1>
      <p>Selamat datang, {user?.email || 'Guest'}!</p>
    </div>
  );
}