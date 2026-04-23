import { getProductionBatches } from '@/actions/production';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductionPage({ searchParams }: { searchParams: { status?: string } }) {
  const currentStatus = searchParams.status || 'ALL';
  const data = await getProductionBatches(currentStatus);
  const batches = Array.isArray(data) ? data : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-neutral-100 text-neutral-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const tabs = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Production Engine</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage production batches and supplier workflows.</p>
        </div>
        <Link 
          href="/dashboard/production/new" 
          className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Batch</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {tabs.map(tab => (
          <Link 
            key={tab} 
            href={`/dashboard/production?status=${tab}`}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              currentStatus === tab 
                ? 'bg-[#D4AF37] text-black shadow-sm' 
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
              <th className="px-6 py-4">Batch ID</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Deadline</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {batches.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No production batches found.
                </td>
              </tr>
            ) : (
              batches.map((batch: any) => (
                <tr key={batch.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-neutral-900">
                    <Link href={`/dashboard/production/${batch.id}`} className="hover:underline">
                      {batch.batchNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{batch.supplier?.email.split('@')[0]}</td>
                  <td className="px-6 py-4 text-neutral-500">{batch.deadline ? new Date(batch.deadline).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{batch._count?.items || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(batch.status)}`}>
                      {batch.status.replace('_', ' ')}
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
