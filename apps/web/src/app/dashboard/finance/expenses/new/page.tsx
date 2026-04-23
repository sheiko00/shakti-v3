'use client';

import { createExpense } from '@/actions/finance';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = [
  'PRODUCT_COST', 'SHIPPING', 'MARKETING', 'SALARY', 
  'TOOL', 'PACKAGING', 'FREELANCER', 'OTHER'
];

export default function RecordExpensePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const date = formData.get('date') as string;
    const notes = formData.get('notes') as string;
    const status = formData.get('status') as string;

    if (!title || !category || isNaN(amount)) {
      setError('Title, category, and amount are required.');
      setIsLoading(false);
      return;
    }

    const result = await createExpense({
      title,
      category,
      amount,
      date,
      notes,
      status,
    });
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/dashboard/finance');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Record Expense</h1>
        <p className="text-sm text-neutral-500 mt-1">Log manual expenses to keep the financial truth layer accurate.</p>
      </div>

      <form action={handleSubmit} className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Expense Title *</label>
            <input 
              name="title" 
              type="text" 
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              placeholder="e.g. Monthly Vercel Bill" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Category *</label>
              <select 
                name="category"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Amount ($) *</label>
              <input 
                name="amount" 
                type="number" 
                step="0.01"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 font-mono" 
                placeholder="0.00" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</label>
              <select 
                name="status"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Date</label>
              <input 
                name="date" 
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Notes</label>
            <textarea 
              name="notes" 
              rows={3}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              placeholder="Any additional details..." 
            ></textarea>
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
            {isLoading ? 'Saving...' : 'Record Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
