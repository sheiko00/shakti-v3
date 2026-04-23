import { getOrders } from '@/actions/orders';
import Link from 'next/link';

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string, page?: string } }) {
  const currentStatus = searchParams.status || 'ALL';
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  
  const response = await getOrders(currentStatus, currentPage);
  const orders = response.data || [];
  const meta = response.meta || { totalPages: 1, page: 1 };

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

  const tabs = ['ALL', 'NEW', 'APPROVED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">Order lifecycle engine and fulfillment tracking.</p>
        </div>
      </div>

      {/* Filters / Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {tabs.map(tab => (
          <Link 
            key={tab} 
            href={`/dashboard/orders?status=${tab}`}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              currentStatus === tab 
                ? 'bg-neutral-900 text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                  No orders found for this filter.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-neutral-900">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{order.customerName}</div>
                    <div className="text-xs text-neutral-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{order.total.toFixed(2)} {order.currency}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/dashboard/orders/${order.id}`}
                      className="text-[#D4AF37] font-medium hover:text-[#C5A030] transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-sm text-neutral-500">
              Page {meta.page} of {meta.totalPages}
            </div>
            <div className="flex gap-2">
              {meta.page > 1 && (
                <Link 
                  href={`/dashboard/orders?status=${currentStatus}&page=${meta.page - 1}`}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  Previous
                </Link>
              )}
              {meta.page < meta.totalPages && (
                <Link 
                  href={`/dashboard/orders?status=${currentStatus}&page=${meta.page + 1}`}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
