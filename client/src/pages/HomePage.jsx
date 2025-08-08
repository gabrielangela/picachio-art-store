import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../configs/firebase';
import { useNavigate, useSearchParams } from 'react-router';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/productsSlice';
import { addToCart } from '../redux/cartSlice';
import { db } from '../configs/firebase';
import { collection, query, where, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';

export default function HomePage() {
  const { user, userRole, userDisplayName, loading } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products, loading: productLoading } = useSelector((state) => state.products);
  
  // URL search parameters for filter persistence
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter and sort state - initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Category');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All Brand');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price-asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageHistory, setPageHistory] = useState([]); // Store document cursors for previous pages
  
  // Dynamic products per page based on screen size
  const [productsPerPage, setProductsPerPage] = useState(15);
  
  // Update products per page based on screen size
  useEffect(() => {
    const updateProductsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1024) { // md breakpoint
        setProductsPerPage(12);
      } else {
        setProductsPerPage(15);
      }
    };
    
    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => window.removeEventListener('resize', updateProductsPerPage);
  }, []);

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

  // Get total count of products matching filters
  const getTotalProductsCount = async () => {
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
      
      const snapshot = await getDocs(q);
      let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Apply search filter client-side
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        products = products.filter(product => 
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
        );
      }
      
      setTotalProducts(products.length);
    } catch (error) {
      console.error('Error getting total count:', error);
      setTotalProducts(0);
    }
  };

  // Filter and sort products using Firestore query with pagination
  const fetchFilteredProducts = async (pageDirection = 'first', cursor = null) => {
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
      
      // If there's a search query, we need to fetch all matching documents and handle pagination client-side
      if (searchQuery.trim()) {
        const snapshot = await getDocs(q);
        let allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), _doc: doc }));
        
        // Apply search filter
        const query = searchQuery.toLowerCase().trim();
        allProducts = allProducts.filter(product => 
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
        );
        
        // Handle client-side pagination
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);
        
        // Update pagination state
        setHasNextPage(endIndex < allProducts.length);
        setHasPrevPage(currentPage > 1);
        
        if (paginatedProducts.length > 0) {
          setFirstDoc(paginatedProducts[0]._doc);
          setLastDoc(paginatedProducts[paginatedProducts.length - 1]._doc);
        } else {
          setFirstDoc(null);
          setLastDoc(null);
        }
        
        // Remove _doc property before setting state
        const cleanProducts = paginatedProducts.map(({ _doc, ...product }) => product);
        setFilteredProducts(cleanProducts);
      } else {
        // Original Firestore pagination for non-search queries
        // Add pagination
        if (pageDirection === 'next' && cursor) {
          q = query(q, startAfter(cursor), limit(productsPerPage + 1)); // +1 to check if there's a next page
        } else if (pageDirection === 'prev' && cursor) {
          // For previous page, start after the cursor from the previous page
          q = query(q, startAfter(cursor), limit(productsPerPage + 1));
        } else {
          q = query(q, limit(productsPerPage + 1)); // First page
        }
        
        const snapshot = await getDocs(q);
        const docs = snapshot.docs;
        
        // Check if there are more pages
        const hasMore = docs.length > productsPerPage;
        const actualDocs = hasMore ? docs.slice(0, productsPerPage) : docs;
        
        const productsData = actualDocs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Update pagination state
        if (actualDocs.length > 0) {
          setFirstDoc(actualDocs[0]);
          setLastDoc(actualDocs[actualDocs.length - 1]);
        } else {
          setFirstDoc(null);
          setLastDoc(null);
        }
        
        setHasNextPage(hasMore);
        setFilteredProducts(productsData);
      }
      
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
      
      // Apply client-side pagination
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const paginatedProducts = fallbackProducts.slice(startIndex, endIndex);
      
      setFilteredProducts(paginatedProducts);
      setTotalProducts(fallbackProducts.length);
      setHasNextPage(endIndex < fallbackProducts.length);
      setHasPrevPage(currentPage > 1);
    }
  };
  
  // Update URL parameters when filters change
  const updateURLParams = (category, brand, sort, search = searchQuery) => {
    const params = new URLSearchParams();
    if (category !== 'All Category') params.set('category', category);
    if (brand !== 'All Brand') params.set('brand', brand);
    if (sort !== 'price-asc') params.set('sort', sort);
    if (search.trim()) params.set('search', search.trim());
    setSearchParams(params);
  };

  // Reset pagination when filters change
  const resetPagination = () => {
    setCurrentPage(1);
    setLastDoc(null);
    setFirstDoc(null);
    setHasNextPage(false);
    setHasPrevPage(false);
    setPageHistory([]);
  };
  
  // Handle next page
  const handleNextPage = () => {
    if (hasNextPage && lastDoc) {
      // Store current page cursor in history
      setPageHistory(prev => [...prev, { page: currentPage, cursor: firstDoc }]);
      setCurrentPage(prev => prev + 1);
      setHasPrevPage(true);
      fetchFilteredProducts('next', lastDoc);
    }
  };
  
  // Handle previous page
  const handlePrevPage = () => {
    if (hasPrevPage && pageHistory.length > 0) {
      const prevPageData = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setCurrentPage(prevPageData.page);
      setHasPrevPage(pageHistory.length > 1);
      
      if (prevPageData.page === 1) {
        // Go back to first page
        fetchFilteredProducts('first');
      } else {
        // Go back to previous page using the stored cursor
        fetchFilteredProducts('prev', prevPageData.cursor);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategoriesAndBrands();
  }, [dispatch]);
  
  // Effect to re-fetch products when filters change
  useEffect(() => {
    if (categories.length > 0 && brands.length > 0) {
      setCurrentPage(1);
      setPageHistory([]);
      fetchFilteredProducts('first');
      getTotalProductsCount();
    }
  }, [selectedCategory, selectedBrand, sortBy, searchQuery, productsPerPage]);
  
  // Fetch products when productsPerPage changes (responsive breakpoint change)
  useEffect(() => {
    if (currentPage === 1) {
      fetchFilteredProducts('first');
    } else {
      // Reset to first page when products per page changes
      resetPagination();
      fetchFilteredProducts('first');
    }
  }, [productsPerPage]);

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
            onClick={() => {
              const currentParams = searchParams.toString();
              navigate(`/add${currentParams ? `?${currentParams}` : ''}`);
            }}
            className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
          >
            + Add Product
          </button>
        )}
        
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                const newSearch = e.target.value;
                setSearchQuery(newSearch);
                updateURLParams(selectedCategory, selectedBrand, sortBy, newSearch);
              }}
              className="w-full px-4 py-2 pl-10 border border-[#cad2c5] rounded-md bg-white text-[#354f52] placeholder-[#8a8f8c] focus:outline-none focus:ring-2 focus:ring-[#52796f] focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#8a8f8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateURLParams(selectedCategory, selectedBrand, sortBy, '');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a8f8c] hover:text-[#52796f]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => {
                const newCategory = e.target.value;
                setSelectedCategory(newCategory);
                updateURLParams(newCategory, selectedBrand, sortBy);
              }}
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
              onChange={(e) => {
                const newBrand = e.target.value;
                setSelectedBrand(newBrand);
                updateURLParams(selectedCategory, newBrand, sortBy);
              }}
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
              onChange={(e) => {
                const newSort = e.target.value;
                setSortBy(newSort);
                updateURLParams(selectedCategory, selectedBrand, newSort);
              }}
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
        Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} product{totalProducts !== 1 ? 's' : ''}
        {searchQuery && ` matching "${searchQuery}"`}
        {selectedCategory !== 'All Category' && ` in ${selectedCategory}`}
        {selectedBrand !== 'All Brand' && ` from ${selectedBrand}`}
        {totalProducts > 0 && (
          <span className="ml-2 text-xs text-[#8a8f8c]">
            (Page {currentPage} of {Math.ceil(totalProducts / productsPerPage)})
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-[#52796f] text-lg mb-2">No products found</div>
            <div className="text-[#8a8f8c] text-sm">
              {searchQuery ? `No products match "${searchQuery}"` : 'Try adjusting your filters or check back later'}
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
              <div className="w-full h-40 bg-[#e0e4e2] flex items-center justify-center text-[#8a8f8c] text-xs mb-3">
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
                    onClick={() => {
                      const currentParams = searchParams.toString();
                      navigate(`/edit/${product.id}${currentParams ? `?${currentParams}` : ''}`);
                    }}
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
      
      {/* Pagination Controls */}
      {totalProducts > productsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              hasPrevPage
                ? 'bg-[#354f52] hover:bg-[#2f3e46] text-white'
                : 'bg-[#e0e4e2] text-[#8a8f8c] cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>
          
          <div className="flex items-center gap-2 text-sm text-[#52796f]">
            <span>Page</span>
            <span className="bg-[#f9fdfb] border border-[#cad2c5] px-3 py-1 rounded-md font-medium">
              {currentPage}
            </span>
            <span>of</span>
            <span className="font-medium">{Math.ceil(totalProducts / productsPerPage)}</span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              hasNextPage
                ? 'bg-[#354f52] hover:bg-[#2f3e46] text-white'
                : 'bg-[#e0e4e2] text-[#8a8f8c] cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
