'use client';

import { createProduct } from '@/actions/products';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('SHAKTI');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [sku, setSku] = useState('');
  const [isSkuAuto, setIsSkuAuto] = useState(true);

  // Auto-generate SKU logic
  useEffect(() => {
    if (isSkuAuto && name) {
      // Basic rule: SH-FIRSTWORD-COLOR-SIZE
      const prefix = brand ? brand.substring(0, 2).toUpperCase() : 'SH';
      const namePart = name.split(' ')[0].toUpperCase().substring(0, 5);
      const colorPart = color ? color.toUpperCase().substring(0, 3) : '';
      const sizePart = size ? size.toUpperCase() : '';
      
      const parts = [prefix, namePart, colorPart, sizePart].filter(Boolean);
      setSku(parts.join('-'));
    }
  }, [name, brand, color, size, isSkuAuto]);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    // Append the controlled SKU
    formData.append('variantSku', sku);
    formData.append('variantColor', color);
    formData.append('variantSize', size);
    
    // Auto-generate slug if not provided
    const slug = formData.get('slug') as string;
    if (!slug && name) {
      formData.set('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }

    const result = await createProduct(formData);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/dashboard/products');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Create New Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Add a new product with its first variant to the catalog.</p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        {/* Basic Info Section */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Product Name</label>
              <input 
                name="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. Signature Silk Shirt" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Brand</label>
              <input 
                name="brand" 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. SHAKTI" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Category</label>
              <input 
                name="category" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. Shirts" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Tags (comma separated)</label>
              <input 
                name="tags" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. Summer, Silk, Luxury" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Description</label>
              <textarea 
                name="description" 
                rows={4}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none" 
                placeholder="Describe your product..." 
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Base Price</label>
              <input 
                name="basePrice" 
                type="number" 
                step="0.01" 
                required 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Cost</label>
              <input 
                name="cost" 
                type="number" 
                step="0.01" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Currency</label>
              <select name="currency" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="SAR">SAR (ر.س)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="EGP">EGP (ج.م)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-2">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Media URLs</h2>
            <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded font-medium">Temporary Storage</span>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Cover Image URL</label>
              <input 
                name="coverImageUrl" 
                type="url"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 font-mono text-sm" 
                placeholder="https://example.com/image.jpg" 
              />
            </div>
          </div>
        </div>

        {/* Initial Variant Section */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-6 border-l-4 border-l-[#D4AF37]">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Initial Variant & SKU</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Color</label>
              <input 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. Black" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Size</label>
              <input 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50" 
                placeholder="e.g. M" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">SKU</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="autoSku" 
                    checked={isSkuAuto}
                    onChange={(e) => setIsSkuAuto(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  <label htmlFor="autoSku" className="text-[10px] text-neutral-500 uppercase cursor-pointer">Auto</label>
                </div>
              </div>
              <input 
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  setIsSkuAuto(false);
                }}
                required
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 font-mono text-sm tracking-wider uppercase" 
                placeholder="SH-PROD-COL-SZ" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
            className="px-8 py-3 bg-neutral-900 hover:bg-black text-white rounded-lg font-medium tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
