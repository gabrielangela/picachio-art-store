import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/productsSlice';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products, loading: productLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth/login');
  };

  const handleDelete = (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;
    dispatch(deleteProduct(id));
  };

  if (loading || productLoading) return <p>Loading...</p>;

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

      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-3 text-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-32 object-contain mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-xs mb-3">
                No Image
              </div>
            )}
            <h2 className="text-sm font-bold uppercase">{product.brand}</h2>
            <p className="text-sm text-gray-700 mb-1">{product.name}</p>
            <p className="text-rose-600 font-semibold mb-2">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => navigate(`/edit/${product.id}`)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
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
