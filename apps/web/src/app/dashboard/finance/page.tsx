import { getFinanceDashboard, getExpenses } from '@/actions/finance';
import Link from 'next/link';
import { DollarSign, TrendingUp, TrendingDown, Receipt, Plus } from 'lucide-react';

export default async function FinanceDashboard() {
  const summaryRes = await getFinanceDashboard();
  const summary = summaryRes.error ? { totalRevenue: 0, totalCosts: 0, netProfit: 0, netMargin: 0, adSpend: 0 } : summaryRes;
  
  const expensesRes = await getExpenses('ALL', 'ALL');
  const expenses = Array.isArray(expensesRes) ? expensesRes : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Finance Engine</h1>
          <p className="text-sm text-neutral-500 mt-1">Financial truth layer. Track revenue, costs, and real profit.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/finance/expenses/new" 
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A030] text-black px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Record Expense</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Gross Revenue</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">${summary.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
        </div>
        
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Costs</p>
              <h3 className="text-2xl font-semibold text-red-600 mt-1">${summary.totalCosts.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
          </div>
        </div>

        <div className="bg-white border border-[#D4AF37] rounded-xl p-5 shadow-sm ring-1 ring-[#D4AF37]/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-600">Net Profit</p>
              <h3 className="text-2xl font-bold text-[#D4AF37] mt-1">${summary.netProfit.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg"><DollarSign size={20} /></div>
          </div>
          <div className="mt-3 text-sm font-medium text-neutral-500">
            Margin: <span className={summary.netMargin > 0 ? "text-green-600" : "text-red-600"}>{summary.netMargin}%</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-neutral-500">Ad Spend</p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">${summary.adSpend.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-neutral-100 text-neutral-600 rounded-lg"><Receipt size={20} /></div>
          </div>
        </div>
      </div>

      {/* Expenses Ledger */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Expense Ledger</h2>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No expenses recorded.
                </td>
              </tr>
            ) : (
              expenses.map((expense: any) => (
                <tr key={expense.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 text-neutral-500">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {expense.title}
                    {expense.productionBatch && <span className="ml-2 text-xs text-neutral-400">({expense.productionBatch.batchNumber})</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{expense.category.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 text-red-600 font-medium">${expense.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(expense.status)}`}>
                      {expense.status}
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
