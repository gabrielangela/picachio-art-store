import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  const { user, userRole } = useAuth();
  const { items: products } = useSelector((state) => state.products);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalClients: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
      
      // Calculate stats
      const totalUsers = usersData.length;
      const totalAdmins = usersData.filter(u => u.role === 'admin').length;
      const totalClients = usersData.filter(u => u.role === 'client').length;
      const totalProducts = products.length;
      
      setStats({
        totalUsers,
        totalAdmins,
        totalClients,
        totalProducts
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only allow access to admins
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] flex items-center justify-center px-6">
        <div className="bg-[#f9fdfb] rounded-lg shadow-md p-8 text-center border border-[#cad2c5] max-w-md">
          <h2 className="text-2xl font-bold text-[#354f52] mb-4">Access Denied</h2>
          <p className="text-[#52796f]">Only administrators can access this dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] flex items-center justify-center">
        <p className="text-[#354f52] text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#354f52] mb-2">Admin Dashboard</h1>
          <p className="text-[#52796f]">Welcome back, {user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f9fdfb] rounded-lg shadow-md p-6 border border-[#cad2c5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#52796f]">Total Users</p>
                <p className="text-2xl font-bold text-[#354f52]">{stats.totalUsers}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          <div className="bg-[#f9fdfb] rounded-lg shadow-md p-6 border border-[#cad2c5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#52796f]">Admins</p>
                <p className="text-2xl font-bold text-[#354f52]">{stats.totalAdmins}</p>
              </div>
              <div className="text-3xl">👑</div>
            </div>
          </div>

          <div className="bg-[#f9fdfb] rounded-lg shadow-md p-6 border border-[#cad2c5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#52796f]">Clients</p>
                <p className="text-2xl font-bold text-[#354f52]">{stats.totalClients}</p>
              </div>
              <div className="text-3xl">👤</div>
            </div>
          </div>

          <div className="bg-[#f9fdfb] rounded-lg shadow-md p-6 border border-[#cad2c5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#52796f]">Products</p>
                <p className="text-2xl font-bold text-[#354f52]">{stats.totalProducts}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5]">
            <div className="p-6 border-b border-[#cad2c5]">
              <h2 className="text-xl font-semibold text-[#354f52]">Recent Users</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.slice(0, 5).map((userData) => (
                  <div key={userData.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#354f52]">{userData.email}</p>
                      <p className="text-sm text-[#52796f]">
                        {userData.displayName || 'No display name'}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userData.role || 'client'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5]">
            <div className="p-6 border-b border-[#cad2c5]">
              <h2 className="text-xl font-semibold text-[#354f52]">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <a
                  href="/add"
                  className="block w-full bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold py-3 px-4 rounded transition text-center"
                >
                  ➕ Add New Product
                </a>
                <a
                  href="/admin-setup"
                  className="block w-full bg-[#4a5759] hover:bg-[#3c4748] text-white font-semibold py-3 px-4 rounded transition text-center"
                >
                  👥 Manage Users
                </a>
                <div className="bg-[#e0e4e2] rounded p-4">
                  <h3 className="font-semibold text-[#354f52] mb-2">Make User Admin</h3>
                  <p className="text-sm text-[#52796f] mb-2">
                    To make picachio@mail.com an admin:
                  </p>
                  <ol className="text-xs text-[#52796f] space-y-1">
                    <li>1. User must login first</li>
                    <li>2. Go to "Manage Users"</li>
                    <li>3. Click "Make Admin" button</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
