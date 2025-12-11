import { useState, useEffect } from 'react';
import api from '../api/client';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    setPage(1); // Reset to page 1 on new search
  }, [searchQuery]);

  useEffect(() => {
    fetchItems();
  }, [searchQuery, page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `/items?q=${searchQuery}&page=${page}`
        : `/items?page=${page}`;
      const response = await api.get(url);
      setItems(response.data);
      if (response.headers['total-pages']) {
        setTotalPages(parseInt(response.headers['total-pages'], 10));
      }
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    const qty = parseInt(value);
    if (qty > 0) {
      setQuantities(prev => ({ ...prev, [itemId]: qty }));
    }
  };

  const handleAddToCart = (item) => {
    const qty = quantities[item.id] || 1;
    dispatch(addToCart({ item, quantity: qty }));
    setQuantities(prev => ({ ...prev, [item.id]: 1 })); // Reset to 1
    toast.success(`Added ${qty} ${item.name}(s) to cart`);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Products</h1>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-500 h-12 overflow-hidden">{item.description}</p>
                <div className="mt-4 flex items-baseline text-2xl font-semibold text-indigo-600">
                  ${parseFloat(item.price).toFixed(2)}
                </div>
                
                <div className="mt-4 flex space-x-3 items-center">
                  <div className="w-20">
                    <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-center focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={quantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      )}

      {/* Pagination Controls */}
      {!loading && items.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`p-2 rounded-full border ${page === 1 ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`p-2 rounded-full border ${page === totalPages ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
