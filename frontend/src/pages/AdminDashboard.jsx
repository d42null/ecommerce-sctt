import { useState, useEffect } from 'react';
import api from '../api/client';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'users'
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null); // null or {}

  useEffect(() => {
    if (activeTab === 'items') fetchItems();
    else fetchUsers();
  }, [activeTab]);

  const fetchItems = async () => {
    const res = await api.get('/items');
    setItems(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const handleSaveItem = async (item) => {
    try {
      if (item.id) {
        await api.put(`/items/${item.id}`, { item });
      } else {
        await api.post('/items', { item });
      }
      setEditingItem(null);
      setNewItem(null);
      fetchItems();
    } catch (error) {
      toast.error("Failed to save item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
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

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {items.map(item => (
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
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
             {users.map(user => (
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

function ItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...item });

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Name"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="sm:col-span-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.description}
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
