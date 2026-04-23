'use client';

import { createProductionBatch } from '@/actions/production';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// In a real app, these would be fetched via API
const MOCK_APPROVED_ORDERS = [
  { id: '1', orderNumber: 'ORD-2026-0001', itemId: 'item-1', product: 'Signature Silk Shirt', quantity: 2 },
  { id: '2', orderNumber: 'ORD-2026-0002', itemId: 'item-2', product: 'Linen Trousers', quantity: 5 },
];
const MOCK_SUPPLIERS = [
  { id: 'sup-1', name: 'Elite Garments Factory' },
  { id: 'sup-2', name: 'Silk Road Textiles' },
];

export default function NewProductionBatchPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [supplierId, setSupplierId] = useState('');

  async function handleSubmit(formData: FormData) {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to produce.');
      return;
    }
    if (!supplierId) {
      setError('Please select a supplier.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const cost = parseFloat(formData.get('cost') as string) || 0;
    const deadline = formData.get('deadline') as string;

    const data = {
      supplierId,
      cost,
      deadline,
      items: selectedItems.map(itemId => {
        const item = MOCK_APPROVED_ORDERS.find(o => o.itemId === itemId);
        return { orderItemId: itemId, quantity: item?.quantity || 1 };
      }),
    };

    const result = await createProductionBatch(data);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/dashboard/production');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Create Production Batch</h1>
        <p className="text-sm text-neutral-500 mt-1">Group approved orders and assign them to a supplier.</p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        {/* Approved Orders Selection */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">1. Select Approved Items</h2>
          <div className="space-y-3">
            {MOCK_APPROVED_ORDERS.map(item => (
              <label key={item.itemId} className="flex items-center p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-[#D4AF37] border-neutral-300 rounded"
                  checked={selectedItems.includes(item.itemId)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedItems([...selectedItems, item.itemId]);
                    else setSelectedItems(selectedItems.filter(id => id !== item.itemId));
                  }}
                />
                <div className="ms-4">
                  <p className="font-medium text-neutral-900">{item.product}</p>
                  <p className="text-xs text-neutral-500">Order: {item.orderNumber} • Qty: {item.quantity}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Assignment Details */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">2. Assignment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Assign to Supplier</label>
              <select 
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="">Select a supplier...</option>
                {MOCK_SUPPLIERS.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Deadline</label>
              <input 
                name="deadline" 
                type="date"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Estimated Cost ($)</label>
              <input 
                name="cost" 
                type="number" 
                step="0.01" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-8 py-3 bg-[#D4AF37] hover:bg-[#C5A030] text-black rounded-lg font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Creating Batch...' : 'Dispatch Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
