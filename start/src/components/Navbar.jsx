import { Link } from 'react-router';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-rose-600">briellicious.</h1>
      <nav className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-rose-600 font-medium">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-rose-600 font-medium">About</Link>
        <Link to="/contact" className="text-gray-700 hover:text-rose-600 font-medium">Contact</Link>
      </nav>
    </header>
  );
}
