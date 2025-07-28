import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/productsSlice';

export default function AddProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    imageUrl: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(addProduct({
        ...form,
        price: Number(form.price)
      }));

      alert("Product added successfully");
      navigate('/');
    } catch (error) {
      alert("Error adding product: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-rose-600 mb-6">Add New Product</h2>

        <label className="block mb-2 text-sm font-medium">Product Name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 text-sm font-medium">Brand</label>
        <input
          name="brand"
          type="text"
          value={form.brand}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 text-sm font-medium">Image URL</label>
        <input
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 text-sm font-medium">Price</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}