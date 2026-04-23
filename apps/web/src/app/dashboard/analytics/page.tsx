import { getPerformanceMetrics } from '@/actions/analytics';
import { BarChart3, TrendingUp, Package, Clock, ShoppingCart, Award } from 'lucide-react';
import Image from 'next/image';

export default async function AnalyticsDashboard() {
  const dataRes = await getPerformanceMetrics();
  const data = dataRes.error ? null : dataRes;

  if (!data) {
    return (
      <div className="p-12 text-center text-neutral-500 bg-white border border-neutral-200 rounded-xl">
        Could not load analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Analytics Hub</h1>
        <p className="text-sm text-neutral-500 mt-1">Real-time performance metrics and intelligent insights.</p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Orders</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{data.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingCart size={20} /></div>
          </div>
        </div>
        
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Gross Revenue</p>
              <h3 className="text-2xl font-semibold text-green-600 mt-1">${data.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Average Order Value</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">${data.averageOrderValue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BarChart3 size={20} /></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Fulfillment Speed</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{data.avgFulfillmentDays} Days</h3>
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2">
            <Award size={18} className="text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Best Selling Products</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {data.bestSellingProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-neutral-500">No product data available yet.</div>
            ) : (
              data.bestSellingProducts.map((product: any, idx: number) => (
                <div key={product.id} className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-neutral-300 w-6">{idx + 1}</div>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                      {product.coverImageUrl ? (
                        <Image src={product.coverImageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{product.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Quantity Sold: <span className="font-semibold text-neutral-700">{product.quantitySold}</span></p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Channel Performance */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Channel Performance (ROAS)</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {data.channelPerformance.length === 0 ? (
                 <div className="text-center text-sm text-neutral-500 py-8">No marketing channel data available yet.</div>
              ) : (
                data.channelPerformance.map((channel: any) => {
                  const maxRoas = Math.max(...data.channelPerformance.map((c: any) => c.roas), 1);
                  const percentage = (channel.roas / maxRoas) * 100;
                  
                  return (
                    <div key={channel.channel} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="font-semibold text-sm text-neutral-900">{channel.channel}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#D4AF37]">{channel.roas}x ROAS</span>
                          <span className="text-xs text-neutral-500 block">Spent: ${channel.spent.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-neutral-800 h-2 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
