'use client';

import { uploadAsset } from '@/actions/assets';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UploadAssetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId') || '';

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const name = formData.get('name') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const type = formData.get('type') as string;
    const tagsString = formData.get('tags') as string;

    if (!name || !fileUrl) {
      setError('Name and URL are required.');
      setIsLoading(false);
      return;
    }

    const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

    const result = await uploadAsset({
      name,
      fileUrl,
      type,
      tags,
      folderId: folderId || null,
    });
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push(`/dashboard/assets${folderId ? `?folder=${folderId}` : ''}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Upload Asset</h1>
        <p className="text-sm text-neutral-500 mt-1">Add an image, video, or document to the creative library.</p>
      </div>

      <form action={handleSubmit} className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Asset Name *</label>
            <input 
              name="name" 
              type="text" 
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              placeholder="e.g. Summer Collection Hero Banner" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Asset URL (Temp) *</label>
            <input 
              name="fileUrl" 
              type="url" 
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
              placeholder="https://..." 
            />
            <p className="text-[11px] text-neutral-400">Direct file URL. In MVP, we link directly instead of uploading to cloud storage.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Asset Type</label>
              <select 
                name="type"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
                <option value="ARCHIVE">Archive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Tags (comma separated)</label>
              <input 
                name="tags" 
                type="text" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="campaign, instagram, raw" 
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
            {isLoading ? 'Uploading...' : 'Save Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}
