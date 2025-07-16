import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth); // ✅ langsung pakai await, nggak perlu disimpan ke variabel
      navigate('/auth/login'); // ✅ path huruf kecil semua
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  }

  return (
    <>
      <div>
        Ada Konten
      </div>
      <button onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}
