import { getFolders, getAssets } from '@/actions/assets';
import Link from 'next/link';
import { Folder, Image as ImageIcon, Upload, Plus } from 'lucide-react';

export default async function AssetsPage({ searchParams }: { searchParams: { folder?: string } }) {
  const folderId = searchParams.folder;
  
  const [foldersData, assetsData] = await Promise.all([
    getFolders(folderId),
    getAssets(folderId)
  ]);

  const folders = Array.isArray(foldersData) ? foldersData : [];
  const assets = Array.isArray(assetsData) ? assetsData : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-neutral-900 tracking-tight">Creative Assets Engine</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage brand guidelines, photoshoots, and marketing media.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/dashboard/assets/new-folder${folderId ? `?parentId=${folderId}` : ''}`} 
            className="flex items-center gap-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Folder size={18} />
            <span>New Folder</span>
          </Link>
          <Link 
            href={`/dashboard/assets/upload${folderId ? `?folderId=${folderId}` : ''}`} 
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A030] text-black px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Upload size={18} />
            <span>Upload Asset</span>
          </Link>
        </div>
      </div>

      {folderId && (
        <div className="flex items-center text-sm text-neutral-500 mb-6">
          <Link href="/dashboard/assets" className="hover:text-neutral-900 transition-colors">Root</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 font-medium">Folder View</span>
        </div>
      )}

      {/* Folders Grid */}
      {folders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder: any) => (
              <Link 
                key={folder.id} 
                href={`/dashboard/assets?folder=${folder.id}`}
                className="group bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-4 hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#D4AF37] transition-colors">
                  <Folder size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 group-hover:text-[#D4AF37] transition-colors">{folder.name}</h3>
                  <p className="text-xs text-neutral-500">{folder._count?.assets || 0} assets, {folder._count?.subFolders || 0} folders</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Assets Grid */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Assets</h2>
        {assets.length === 0 ? (
          <div className="bg-white border border-dashed border-neutral-300 rounded-xl py-16 text-center">
            <ImageIcon size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium">No assets found in this location.</p>
            <p className="text-xs text-neutral-400 mt-1">Upload an image or video to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.map((asset: any) => (
              <div key={asset.id} className="group relative bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden aspect-square">
                {asset.type === 'IMAGE' ? (
                  <img src={asset.fileUrl} alt={asset.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white">
                    <span className="font-mono text-sm">{asset.type}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                  <p className="text-neutral-300 text-xs mt-1 truncate">By {asset.uploadedBy?.email.split('@')[0]}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {asset.tags?.slice(0,2).map((tag: string) => (
                      <span key={tag} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
