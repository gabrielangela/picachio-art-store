import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold text-rose-600 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-2">Need help? We'd love to hear from you.</p>
      <br></br>

      <div className="space-y-6">
          {/* Row 1 - Phone & WhatsApp */}
          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-rose-600 mb-3">Phone</h3>
              <p className="text-gray-700">888-999-000</p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-rose-600 mb-3">WhatsApp</h3>
              <p className="text-gray-700">0888-999-111</p>
            </div>
          </div>

          {/* Row 2 - Email & Store Address */}
          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-rose-600 mb-3">Email</h3>
              <p className="text-gray-700">support@briellcious.com</p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-rose-600 mb-3">Store Address</h3>
              <p className="text-gray-700">Jl. Mawar No. 123, Jakarta Selatan</p>
            </div>
          </div>
        </div>

    </div>
  );
}