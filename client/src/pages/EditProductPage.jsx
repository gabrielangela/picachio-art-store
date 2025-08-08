import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../redux/productsSlice';
import { db } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

export default function EditProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    imageUrl: '',
    price: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      } else {
        alert('Product not found');
        // Preserve filter state even when product not found
        const searchParams = new URLSearchParams(location.search);
        navigate(`/?${searchParams.toString()}`);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct({ id, updated: { ...form, price: Number(form.price) } }));
      alert('Product updated successfully');
      // Preserve filter state by including current search params
      const searchParams = new URLSearchParams(location.search);
      navigate(`/?${searchParams.toString()}`);
    } catch (error) {
      alert('Error updating product: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f9fdfb] shadow-lg rounded-lg p-8 w-full max-w-md border border-[#84a98c]"
      >
        <h2 className="text-2xl font-bold text-center text-[#354f52] mb-6">
          Edit Product
        </h2>

        <label className="block mb-2 text-sm font-medium text-[#2f3e46]">Product Name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          required
        />

        <label className="block mb-2 text-sm font-medium text-[#2f3e46]">Brand</label>
        <input
          name="brand"
          type="text"
          value={form.brand}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          required
        />

        <label className="block mb-2 text-sm font-medium text-[#2f3e46]">Category</label>
        <input
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          required
        />

        <label className="block mb-2 text-sm font-medium text-[#2f3e46]">Image</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            name="imageUrl"
            type="text"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-2 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          />
          <span className="mx-2 text-[#52796f]">OR</span>
          <FileUploaderRegular
            pubkey="07c2b8b3d67ddf12ae99"
            onFileUploadSuccess={(result) => {
              console.log('Upload Success → CDN URL:', result.cdnUrl);
              setForm((prev) => ({ ...prev, imageUrl: result.cdnUrl }));
            }}
            className="uc-file-uploader-regular"
          />
        </div>

        <label className="block mb-2 text-sm font-medium text-[#2f3e46]">Price</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full mb-6 p-2 border border-[#cad2c5] rounded focus:outline-none focus:ring-2 focus:ring-[#52796f]"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold py-2 px-4 rounded transition"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-[#cad2c5] hover:bg-[#84a98c] text-[#354f52] font-semibold py-2 px-4 rounded transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
