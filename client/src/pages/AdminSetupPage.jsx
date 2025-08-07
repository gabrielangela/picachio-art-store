import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../configs/firebase';
import { useAuth } from '../context/AuthContext';
import { setUserRole, initializeUser } from '../utils/userUtils';

export default function AdminSetupPage() {
  const { user, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    role: 'client'
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await setUserRole(userId, newRole);
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      alert('Error updating user role: ' + error.message);
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    
    try {
      // Generate a unique ID for the user (simulating Firebase Auth UID)
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create user document directly in Firestore (no Firebase Auth account)
      await setDoc(doc(db, 'users', userId), {
        email: registerForm.email,
        role: registerForm.role,
        password: registerForm.password, // In real app, this should be hashed
        createdAt: new Date(),
        createdBy: user.email,
        isManuallyCreated: true, // Flag to indicate this was created by admin
        status: 'pending_activation' // User needs to activate account on first login
      });
      
      // Refresh users list
      await fetchUsers();
      
      // Reset form
      setRegisterForm({ email: '', password: '', role: 'client' });
      setShowRegisterForm(false);
      
      alert(`New ${registerForm.role} account created successfully! User will need to activate account on first login.`);
    } catch (error) {
      alert('Error creating user: ' + error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    const confirmDelete = confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      
      alert(`User ${userEmail} deleted successfully`);
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const handleEditUser = (userData) => {
    setEditingUser(userData);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    try {
      await setUserRole(editingUser.id, editingUser.role);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, role: editingUser.role } : u
      ));
      
      setShowEditModal(false);
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  };

  // Only allow access to admins
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] flex items-center justify-center px-6">
        <div className="bg-[#f9fdfb] rounded-lg shadow-md p-8 text-center border border-[#cad2c5] max-w-md">
          <h2 className="text-2xl font-bold text-[#354f52] mb-4">Access Denied</h2>
          <p className="text-[#52796f]">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] flex items-center justify-center">
        <p className="text-[#354f52] text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#354f52] mb-2">User Management</h1>
              <p className="text-[#52796f]">Manage user accounts and roles</p>
            </div>
            <button
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
            >
              {showRegisterForm ? 'Cancel' : '+ Register New User'}
            </button>
          </div>
        </div>

        {/* Register New User Form */}
        {showRegisterForm && (
          <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5] p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#354f52] mb-4">Register New User</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#354f52] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="w-full p-3 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#354f52] mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="w-full p-3 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#354f52] mb-2">Role</label>
                <select
                  name="role"
                  value={registerForm.role}
                  onChange={handleRegisterChange}
                  className="w-full p-3 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="bg-[#354f52] hover:bg-[#2f3e46] disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded transition"
                >
                  {registerLoading ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="bg-[#cad2c5] hover:bg-[#84a98c] text-[#354f52] font-semibold px-6 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5] overflow-hidden">
          <div className="p-6 border-b border-[#cad2c5]">
            <h2 className="text-xl font-semibold text-[#354f52]">Manage User Roles</h2>
            <p className="text-[#52796f] text-sm mt-1">
              Assign admin or client roles to registered users
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e0e4e2]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#354f52] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#354f52] uppercase tracking-wider">
                    Display Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#354f52] uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#354f52] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cad2c5]">
                {users.map((userData) => (
                  <tr key={userData.id} className="hover:bg-[#f5f7f5]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#354f52]">
                      {userData.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#52796f]">
                      {userData.displayName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {userData.role || 'client'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {userData.id === user.uid ? (
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Current User
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleEditUser(userData)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-[#354f52] hover:bg-[#2f3e46] text-white transition"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-[#52796f]">No users found</p>
            </div>
          )}
        </div>
        
        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#f9fdfb] rounded-lg shadow-xl p-6 w-full max-w-md border border-[#cad2c5]">
              <h2 className="text-xl font-semibold text-[#354f52] mb-4">Edit User</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#354f52] mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full p-3 border border-[#cad2c5] rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#354f52] mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full p-3 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="bg-[#e0e4e2] rounded p-3">
                  <p className="text-sm text-[#52796f] mb-2">
                    <strong>Current Role:</strong> {editingUser.role === 'admin' ? '👑 Admin' : '👤 Client'}
                  </p>
                  {editingUser.createdBy && (
                    <p className="text-xs text-[#84a98c]">
                      Created by: {editingUser.createdBy}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-4 py-2 rounded transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-[#cad2c5] hover:bg-[#84a98c] text-[#354f52] font-semibold px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
              
              <hr className="my-4 border-[#cad2c5]" />
              
              <div className="text-center">
                <p className="text-sm text-[#52796f] mb-3">Danger Zone</p>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    handleDeleteUser(editingUser.id, editingUser.email);
                    setEditingUser(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-[#f9fdfb] rounded-lg shadow-md p-6 border border-[#cad2c5]">
          <h3 className="text-lg font-semibold text-[#354f52] mb-3">Instructions</h3>
          <ul className="text-sm text-[#52796f] space-y-2">
            <li>• <strong>Admin</strong>: Can create, edit, and delete products</li>
            <li>• <strong>Client</strong>: Can view products and add them to cart</li>
            <li>• Click <strong>"Edit"</strong> to change user role or delete user</li>
            <li>• You cannot edit your own account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
