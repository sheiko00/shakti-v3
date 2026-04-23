'use client';

import { createShipment } from '@/actions/shipping';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// In reality, this should be fetched from API (orders with status = READY)
const MOCK_READY_ORDERS = [
  { id: '1', orderNumber: 'ORD-2026-0001', customerName: 'Ahmed Ali' },
  { id: '2', orderNumber: 'ORD-2026-0003', customerName: 'Sara Khaled' },
];

const CARRIERS = ['DHL', 'Aramex', 'FedEx', 'SMSA', 'Local Courier'];

export default function NewShipmentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const orderId = formData.get('orderId') as string;
    const trackingNumber = formData.get('trackingNumber') as string;
    const carrier = formData.get('carrier') as string;
    const shippingCost = parseFloat(formData.get('shippingCost') as string) || 0;

    if (!orderId || !trackingNumber || !carrier) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    const result = await createShipment({
      orderId,
      trackingNumber,
      carrier,
      shippingCost,
    });
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/dashboard/shipping');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Dispatch Order</h1>
        <p className="text-sm text-neutral-500 mt-1">Assign a ready order to a shipping carrier.</p>
      </div>

      <form action={handleSubmit} className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Select Ready Order *</label>
            <select 
              name="orderId"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            >
              <option value="">Select an order...</option>
              {MOCK_READY_ORDERS.map(order => (
                <option key={order.id} value={order.id}>{order.orderNumber} - {order.customerName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Carrier *</label>
              <select 
                name="carrier"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="">Select carrier...</option>
                {CARRIERS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Tracking Number *</label>
              <input 
                name="trackingNumber" 
                type="text" 
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 font-mono" 
                placeholder="e.g. DHL-987654321" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actual Shipping Cost ($)</label>
            <input 
              name="shippingCost" 
              type="number" 
              step="0.01" 
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              placeholder="0.00" 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
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
            {isLoading ? 'Dispatching...' : 'Dispatch Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}
