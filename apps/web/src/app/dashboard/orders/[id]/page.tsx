import { getOrder } from '@/actions/orders';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (order.error) {
    return <div className="p-8 text-center text-red-500">Error loading order: {order.error}</div>;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'APPROVED': return 'bg-indigo-100 text-indigo-800';
      case 'IN_PRODUCTION': return 'bg-purple-100 text-purple-800';
      case 'READY': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-bold text-neutral-900">{order.orderNumber}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">Total Amount</p>
          <p className="text-2xl font-light text-neutral-900">{order.total.toFixed(2)} {order.currency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Items and Customer Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                      {item.product?.coverImageUrl ? (
                        <img src={item.product.coverImageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">No Img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-neutral-500 font-mono mt-1">SKU: {item.variant?.sku}</p>
                      <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right font-medium">
                    {(item.price * item.quantity).toFixed(2)} {order.currency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100">Customer & Shipping</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 uppercase">Name</p>
                <p className="font-medium text-neutral-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase">Contact</p>
                <p className="font-medium text-neutral-900">{order.customerEmail}</p>
                <p className="text-sm text-neutral-600">{order.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-neutral-500 uppercase">Shipping Address</p>
                <p className="font-medium text-neutral-900">{order.shippingAddress}, {order.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-xl shadow-sm text-white">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-4 pb-2 border-b border-neutral-800">Status Timeline</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-800 before:to-transparent">
              {order.statusHistory.map((history: any, idx: number) => (
                <div key={history.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-neutral-900 bg-[#D4AF37] text-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-neutral-800 bg-black/50 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-neutral-200 text-xs">{history.status}</div>
                      <time className="text-[10px] text-neutral-500 font-mono">{new Date(history.createdAt).toLocaleDateString()}</time>
                    </div>
                    <div className="text-[11px] text-neutral-400">By: {history.changedBy.email.split('@')[0]}</div>
                    {history.notes && <div className="text-xs text-neutral-300 mt-2 p-2 bg-neutral-900 rounded">{history.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
