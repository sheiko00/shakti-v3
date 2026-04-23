'use client';

import { createCampaign } from '@/actions/marketing';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CHANNELS = ['META', 'GOOGLE', 'TIKTOK', 'INFLUENCER', 'EMAIL', 'AFFILIATE', 'ORGANIC'];

export default function NewCampaignPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const name = formData.get('name') as string;
    const objective = formData.get('objective') as string;
    const channel = formData.get('channel') as string;
    const budget = parseFloat(formData.get('budget') as string) || 0;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (!name || !channel) {
      setError('Name and channel are required.');
      setIsLoading(false);
      return;
    }

    const result = await createCampaign({
      name,
      objective,
      channel,
      budget,
      startDate,
      endDate,
    });
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/dashboard/marketing');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Launch Campaign</h1>
        <p className="text-sm text-neutral-500 mt-1">Create a new marketing campaign to drive revenue.</p>
      </div>

      <form action={handleSubmit} className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Campaign Name *</label>
            <input 
              name="name" 
              type="text" 
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              placeholder="e.g. Summer Launch 2026 - TikTok UGC" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Channel *</label>
              <select 
                name="channel"
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="">Select channel...</option>
                {CHANNELS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Objective</label>
              <input 
                name="objective" 
                type="text" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. Conversions / Awareness" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Planned Budget ($)</label>
              <input 
                name="budget" 
                type="number" 
                step="0.01"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="0.00" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Start Date</label>
              <input 
                name="startDate" 
                type="date" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">End Date</label>
              <input 
                name="endDate" 
                type="date" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              />
            </div>
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
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
