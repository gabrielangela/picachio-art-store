import { useAuth } from '../context/AuthContext';

export default function AboutPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold text-rose-600 mb-4">About briellicious.</h1>
      <p className="text-gray-700 mb-2">
        briellicious. is your go-to destination for body care and beauty. We believe self-love starts with self-care.
      </p>
    </div>
  );
}