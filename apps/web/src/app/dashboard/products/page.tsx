import { getProducts } from '@/actions/products';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductsPage() {
  const data = await getProducts();
  const products = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your product catalog, pricing, and variants.</p>
        </div>
        <Link 
          href="/dashboard/products/new" 
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A030] text-black px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Base Price</th>
              <th className="px-6 py-4">Variants</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{product.title}</td>
                  <td className="px-6 py-4 text-neutral-500">{product.category || '-'}</td>
                  <td className="px-6 py-4 text-neutral-900">${product.basePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-neutral-500">{product.variants?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {product.status}
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
