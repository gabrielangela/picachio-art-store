import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    const confirmClear = confirm('Are you sure you want to clear your cart?');
    if (confirmClear) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!');
    // In a real app, this would integrate with payment processing
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#354f52] mb-8">Your Cart</h1>
          <div className="bg-[#f9fdfb] rounded-lg shadow-md p-8 text-center">
            <p className="text-[#52796f] text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold px-6 py-2 rounded transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cad2c5] to-[#84a98c] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#354f52]">Your Cart</h1>
          <button
            onClick={handleClearCart}
            className="bg-[#4a5759] hover:bg-[#3c4748] text-white font-semibold px-4 py-2 rounded transition"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#f9fdfb] rounded-lg shadow-md p-4 border border-[#cad2c5]">
                <div className="flex items-center gap-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#e0e4e2] flex items-center justify-center text-[#8a8f8c] text-xs rounded">
                      No Image
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2f3e46] uppercase">{item.brand}</h3>
                    <p className="text-[#52796f]">{item.name}</p>
                    <p className="text-[#354f52] font-semibold">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-[#cad2c5] hover:bg-[#b0c4b1] text-[#354f52] w-8 h-8 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-[#354f52]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-[#cad2c5] hover:bg-[#b0c4b1] text-[#354f52] w-8 h-8 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#354f52]">
                      Rp {Number(item.totalPrice).toLocaleString('id-ID')}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-[#4a5759] hover:text-[#3c4748] text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#f9fdfb] rounded-lg shadow-md p-6 border border-[#cad2c5] sticky top-4">
              <h2 className="text-xl font-bold text-[#354f52] mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[#52796f]">
                  <span>Items ({totalQuantity})</span>
                  <span>Rp {Number(totalAmount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#52796f]">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr className="border-[#cad2c5]" />
                <div className="flex justify-between font-bold text-[#354f52] text-lg">
                  <span>Total</span>
                  <span>Rp {Number(totalAmount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#354f52] hover:bg-[#2f3e46] text-white font-semibold py-3 px-4 rounded transition mb-3"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#cad2c5] hover:bg-[#b0c4b1] text-[#354f52] font-semibold py-2 px-4 rounded transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
