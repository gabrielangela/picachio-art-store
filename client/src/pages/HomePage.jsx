import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';

export default function HomePage() {
  const { user, userRole, userDisplayName, loading } = useAuth();
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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  if (loading || productLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#354f52]">products catalog</h1>
        <div>
          <span className="text-sm text-[#52796f] mr-4">
            {userRole === 'admin' ? (
              <>Logged in as <strong>{user?.email || 'client'}</strong></>
            ) : (
              <>Welcome <strong>{userDisplayName || user?.email || 'client'}</strong>! Let’s turn your ideas into art</>
            )}
          </span>
          <button
            onClick={handleLogout}
            className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Admin-only Add Product button */}
      {userRole === 'admin' && (
        <div className="mb-6">
          <button
            onClick={() => navigate('/add')}
            className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
          >
            + Add Product
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-[#f9fdfb] rounded-lg shadow-md p-3 text-center border border-[#cad2c5]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-32 object-contain mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-[#e0e4e2] flex items-center justify-center text-[#8a8f8c] text-xs mb-3">
                No Image
              </div>
            )}
            <h2 className="text-sm font-bold uppercase text-[#2f3e46]">{product.brand}</h2>
            <p className="text-sm text-[#52796f] mb-1">{product.name}</p>
            <p className="text-[#354f52] font-semibold mb-2">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </p>
            {/* Different buttons based on user role */}
            <div className="flex justify-center gap-2">
              {userRole === 'admin' ? (
                // Admin view: Edit and Delete buttons
                <>
                  <button
                    onClick={() => navigate(`/edit/${product.id}`)}
                    className="bg-[#b0c4b1] hover:bg-[#9cb3a1] text-white text-sm px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-[#4a5759] hover:bg-[#3c4748] text-white text-sm px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              ) : (
                // Client view: Add to Cart button
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#354f52] hover:bg-[#2f3e46] text-white text-sm px-4 py-1 rounded transition"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
