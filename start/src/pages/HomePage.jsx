import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../configs/firebase';
import { useNavigate } from 'react-router';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth/login');
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(data);
  };

  const handleDelete = async (id) => {
  const confirmDelete = confirm('Are you sure you want to delete this product?');
  if (!confirmDelete) return;

  await deleteDoc(doc(db, 'products', id));
  fetchProducts(); // refresh list
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-rose-600">briellicious.</h1>
        <div>
          <span className="text-sm text-gray-600 mr-4">
            Logged in as <strong>{user?.email || 'Guest'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={() => navigate('/add')}
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 text-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-contain mb-4"
            />
            <h2 className="text-sm font-bold">{product.brand}</h2>
            <p className="text-sm text-gray-700 mb-1">{product.name}</p>
            <p className="text-rose-600 font-semibold mb-2">Rp {Number(product.price).toLocaleString('id-ID')}</p>
            <div className="flex justify-center gap-2">
              <button
              onClick={() => navigate(`/edit/${product.id}`)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded"
              >
              Edit
              </button>

              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
