import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Contact Page</h1>
      <p>Silakan hubungi kami, {user?.email || 'Guest'}.</p>
    </div>
  );
}
