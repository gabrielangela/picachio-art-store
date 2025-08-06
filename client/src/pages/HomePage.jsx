import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate } from 'react-router';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';
import { db } from '../configs/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default function HomePage() {
  const { user, userRole, userDisplayName, loading } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products, loading: productLoading } = useSelector((state) => state.products);
  
  // Filter and sort state
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedBrand, setSelectedBrand] = useState('All Brand');
  const [sortBy, setSortBy] = useState('price-asc');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch unique categories and brands
  const fetchCategoriesAndBrands = async () => {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      const categoriesSet = new Set();
      const brandsSet = new Set();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) categoriesSet.add(data.category);
        if (data.brand) brandsSet.add(data.brand);
      });
      
      setCategories(['All Category', ...Array.from(categoriesSet).sort()]);
      setBrands(['All Brand', ...Array.from(brandsSet).sort()]);
    } catch (error) {
      console.error('Error fetching categories and brands:', error);
    }
  };

  // Filter and sort products using Firestore query
  const fetchFilteredProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      let q = query(productsRef);
      
      // Add where clauses for filtering
      if (selectedCategory !== 'All Category') {
        q = query(q, where('category', '==', selectedCategory));
      }
      if (selectedBrand !== 'All Brand') {
        q = query(q, where('brand', '==', selectedBrand));
      }
      
      // Add orderBy for sorting
      const priceDirection = sortBy === 'price-desc' ? 'desc' : 'asc';
      q = query(q, orderBy('price', priceDirection), orderBy('category', 'asc'));
      
      const snapshot = await getDocs(q);
      const productsData = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });
      
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      // Fallback to Redux products if Firestore query fails
      let fallbackProducts = [...products];
      
      // Apply client-side filtering if Firestore query fails
      if (selectedCategory !== 'All Category') {
        fallbackProducts = fallbackProducts.filter(p => p.category === selectedCategory);
      }
      if (selectedBrand !== 'All Brand') {
        fallbackProducts = fallbackProducts.filter(p => p.brand === selectedBrand);
      }
      
      // Apply client-side sorting
      fallbackProducts.sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        
        if (sortBy === 'price-desc') {
          if (priceB !== priceA) return priceB - priceA;
        } else {
          if (priceA !== priceB) return priceA - priceB;
        }
        
        // Secondary sort by category (ascending)
        return a.category.localeCompare(b.category);
      });
      
      setFilteredProducts(fallbackProducts);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategoriesAndBrands();
  }, [dispatch]);
  
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, sortBy, products]);

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

      {/* Top Controls Bar - Add Product Button and Filter Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        {/* Admin-only Add Product button */}
        {userRole === 'admin' && (
          <button
            onClick={() => navigate('/add')}
            className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
          >
            + Add Product
          </button>
        )}
        
        {/* Filter Controls */}
        <div className="flex flex-wrap items-end gap-4 flex-1">
          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-[#cad2c5] rounded-md bg-white text-[#354f52] focus:outline-none focus:ring-2 focus:ring-[#52796f] focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-[#cad2c5] rounded-md bg-white text-[#354f52] focus:outline-none focus:ring-2 focus:ring-[#52796f] focus:border-transparent"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-[#cad2c5] rounded-md bg-white text-[#354f52] focus:outline-none focus:ring-2 focus:ring-[#52796f] focus:border-transparent"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price:High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-[#52796f]">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        {selectedCategory !== 'All Category' && ` in ${selectedCategory}`}
        {selectedBrand !== 'All Brand' && ` from ${selectedBrand}`}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-[#52796f] text-lg mb-2">No products found</div>
            <div className="text-[#8a8f8c] text-sm">
              Try adjusting your filters or check back later
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
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
        ))
        )}
      </div>
    </div>
  );
}
