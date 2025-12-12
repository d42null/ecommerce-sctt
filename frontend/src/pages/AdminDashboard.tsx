import { useState } from 'react';
import { 
  useGetItemsQuery, 
  useGetUsersQuery, 
  useCreateItemMutation, 
  useUpdateItemMutation, 
  useDeleteItemMutation 
} from '../store/api/apiSlice';
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'users'
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [newItem, setNewItem] = useState<Partial<Product> | null>(null); // null or {}
  const [page, setPage] = useState(1);

  // Queries
  const { data: itemsData } = useGetItemsQuery({ page, q: '' });
  const items = itemsData?.items || [];
  const totalPages = itemsData?.meta?.totalPages || 1;
  
  const { data: users = [] } = useGetUsersQuery(undefined, {
      skip: activeTab !== 'users',
  });

  // Mutations
  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [deleteItem] = useDeleteItemMutation();

  const handleSaveItem = async (item: Partial<Product>) => {
    try {
      if (item.id) {
        await updateItem({ id: item.id, item }).unwrap();
      } else {
        await createItem(item).unwrap();
      }
      setEditingItem(null);
      setNewItem(null);
      toast.success("Item saved successfully");
    } catch (error) {
      toast.error("Failed to save item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteItem(id).unwrap();
      toast.success("Item deleted");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`${activeTab === 'items' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Items Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Users Management
          </button>
        </nav>
      </div>

      {activeTab === 'items' && (
        <div>
          <button
            onClick={() => setNewItem({ name: '', description: '', price: '' })}
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Item
          </button>

          {newItem && (
            <ItemForm item={newItem} onSave={handleSaveItem} onCancel={() => setNewItem(null)} />
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <ul className="divide-y divide-gray-200">
              {items.map((item: Product) => (
                <li key={item.id} className="px-6 py-4">
                  {editingItem?.id === item.id ? (
                    <ItemForm item={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="text-sm font-bold text-indigo-600">${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => setEditingItem(item)} className="text-indigo-600 hover:text-indigo-900">
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
           <ul className="divide-y divide-gray-200">
             {users.map((user: any) => ( // Using any if User interface doesn't match perfectly or just to be safe quickly
               <li key={user.id} className="px-6 py-4 flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-medium text-gray-900">{user.first_name} {user.last_name}</h3>
                   <p className="text-sm text-gray-500">{user.email}</p>
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                     {user.role}
                   </span>
                 </div>
                 {/* Provide user editing if needed */}
               </li>
             ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ItemForm({ item, onSave, onCancel }: { item: Partial<Product>, onSave: (item: Partial<Product>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Product>>({ ...item });

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Name"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.name || ''}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.price || ''}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="sm:col-span-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={() => onSave(formData)} className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700">
          Save
        </button>
      </div>
    </div>
  );
}
