import { getCampaigns } from '@/actions/marketing';
import Link from 'next/link';
import { Target, TrendingUp, BarChart2, Plus, Tag } from 'lucide-react';

export default async function MarketingDashboard() {
  const data = await getCampaigns('ALL', 'ALL');
  const campaigns = Array.isArray(data) ? data : [];

  // Calculate high-level KPIs
  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.kpi?.revenue || 0), 0);
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0.00';

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return 'bg-neutral-100 text-neutral-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'ARCHIVED': return 'bg-neutral-100 text-neutral-500';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Revenue Growth Engine</h1>
          <p className="text-sm text-neutral-500 mt-1">Marketing dashboard, campaign attribution, and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/marketing/promo/new" 
            className="flex items-center gap-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Tag size={18} />
            <span>New Promo</span>
          </Link>
          <Link 
            href="/dashboard/marketing/campaigns/new" 
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A030] text-black px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Campaign</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Spend</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">${totalSpend.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
        </div>
        
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Attributed Revenue</p>
              <h3 className="text-2xl font-semibold text-[#D4AF37] mt-1">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><BarChart2 size={20} /></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Global ROAS</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">{roas}x</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target size={20} /></div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Active Campaigns</h2>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Spend</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">ROAS</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                  No campaigns found. Start growing your revenue.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign: any) => {
                const cmpRoas = campaign.spent > 0 ? (campaign.kpi?.revenue / campaign.spent).toFixed(2) : '0.00';
                return (
                  <tr key={campaign.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">{campaign.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{campaign.channel}</td>
                    <td className="px-6 py-4">${campaign.spent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[#D4AF37] font-medium">${(campaign.kpi?.revenue || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">{cmpRoas}x</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
