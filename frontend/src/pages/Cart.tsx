import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { useCreateOrderMutation } from '../store/api/apiSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const payload = {
        items: cartItems.map(item => ({
          item_id: item.id,
          quantity: item.quantity
        }))
      };

      await createOrder(payload).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error('Checkout failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-500">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item.id} className="p-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <div className="mt-2 text-sm text-gray-700">
                  Quantity: {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                </div>
              </div>
              <div className="ml-6 flex items-center">
                 <span className="text-lg font-bold text-gray-900 mr-6">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                 </span>
                 <button 
                   onClick={() => dispatch(removeFromCart(item.id))}
                   className="text-red-600 hover:text-red-900"
                 >
                   <Trash2 className="h-5 w-5" />
                 </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-xl font-bold text-gray-900">
            Total: ${totalAmount.toFixed(2)}
          </div>
          <button
            onClick={handleCheckout}
            className="bg-indigo-600 border border-transparent rounded-md py-2 px-6 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
