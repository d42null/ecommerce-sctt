import { useState } from 'react';
import { useGetOrdersQuery } from '../store/api/apiSlice';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Orders() {
  const { data: orders = [], isLoading: loading, error } = useGetOrdersQuery(); 
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrder = (orderId: number) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading orders. Please try again.</div>;
  if (!orders || orders.length === 0) return <div className="text-center py-10">No orders found.</div>;

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
      <div className="space-y-4">
        {orders.map((order: any) => ( // Using any here because backend structure might differ slightly from Order interface (e.g. amount vs total_amount)
          <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div 
              className="px-4 py-4 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 bg-gray-50"
              onClick={() => toggleOrder(order.id)}
            >
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order #{order.id}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Total: <span className="font-bold text-indigo-600">${parseFloat(order.amount).toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                {expandedOrders[order.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            
            {expandedOrders[order.id] && (
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {order.order_descriptions.map((desc: any) => (
                    <li key={desc.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-900">
                        {desc.item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {desc.quantity} x ${parseFloat(desc.item.price).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
