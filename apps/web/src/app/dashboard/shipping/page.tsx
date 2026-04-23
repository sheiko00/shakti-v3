import { getShipments } from '@/actions/shipping';
import Link from 'next/link';
import { Truck } from 'lucide-react';

export default async function ShippingPage({ searchParams }: { searchParams: { status?: string } }) {
  const currentStatus = searchParams.status || 'ALL';
  const data = await getShipments(currentStatus);
  const shipments = Array.isArray(data) ? data : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-neutral-100 text-neutral-800';
      case 'PICKED_UP': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY': return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'FAILED_DELIVERY': return 'bg-orange-100 text-orange-800';
      case 'RETURNED': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const tabs = ['ALL', 'PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Shipping Engine</h1>
          <p className="text-sm text-neutral-500 mt-1">Track fulfillments, carriers, and final mile delivery.</p>
        </div>
        <Link 
          href="/dashboard/shipping/new" 
          className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Truck size={18} />
          <span>Dispatch Order</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {tabs.map(tab => (
          <Link 
            key={tab} 
            href={`/dashboard/shipping?status=${tab}`}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              currentStatus === tab 
                ? 'bg-[#D4AF37] text-black shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Tracking #</th>
              <th className="px-6 py-4">Carrier</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {shipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No shipments found.
                </td>
              </tr>
            ) : (
              shipments.map((shipment: any) => (
                <tr key={shipment.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-neutral-900">{shipment.trackingNumber}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{shipment.carrier}</td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/orders/${shipment.orderId}`} className="text-[#D4AF37] hover:underline">
                      {shipment.order?.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{shipment.order?.customerName}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
