import { useAuth } from '../context/AuthContext';

export default function AboutPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5] p-8 text-center mb-8">
        <h1 className="text-3xl font-bold text-[#354f52] mb-6">About Picachio.</h1>
        <p className="text-[#52796f] text-lg mb-4">
          Welcome to Picachio - your premier destination for high-quality art supplies and creative materials.
        </p>
        <p className="text-[#84a98c] mb-6">
          We are passionate about empowering artists of all levels with the finest tools to bring their creative visions to life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5] p-6">
          <h2 className="text-xl font-semibold text-[#354f52] mb-4 flex items-center">
            🎨 Our Products
          </h2>
          <ul className="text-[#52796f] space-y-2 text-left">
            <li>• Premium Oil Paints & Mediums</li>
            <li>• Professional Watercolor Sets</li>
            <li>• Acrylic Paints & Brushes</li>
            <li>• Canvas & Drawing Papers</li>
            <li>• Sketching & Drawing Tools</li>
            <li>• Art Storage & Organization</li>
          </ul>
        </div>

        <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5] p-6">
          <h2 className="text-xl font-semibold text-[#354f52] mb-4 flex items-center">
            ✨ Why Choose Us?
          </h2>
          <ul className="text-[#52796f] space-y-2 text-left">
            <li>• Curated selection of premium brands</li>
            <li>• Competitive prices for all budgets</li>
            <li>• Expert advice from fellow artists</li>
            <li>• Fast and secure shipping</li>
            <li>• Supporting the creative community</li>
            <li>• Quality guaranteed products</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#f9fdfb] rounded-lg shadow-md border border-[#cad2c5] p-8 text-center">
        <h2 className="text-2xl font-semibold text-[#354f52] mb-4">Our Mission</h2>
        <p className="text-[#52796f] text-lg mb-4">
          At Picachio, we believe that every artist deserves access to exceptional art supplies that inspire creativity and enable artistic expression.
        </p>
        <p className="text-[#84a98c]">
          Whether you're a professional artist, art student, or hobbyist, we're here to support your creative journey with the finest materials and tools available.
        </p>
      </div>
    </div>
  );
}