import { login } from '@/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">SHAKTI</h1>
          <p className="text-sm text-neutral-500 tracking-wide uppercase">Operating System</p>
        </div>

        <form action={async (formData) => {
          'use server';
          await login(formData);
        }} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="email">
              Work Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-colors"
              placeholder="name@shakti.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-neutral-500 hover:text-[#D4AF37] transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-black text-white rounded-lg font-medium tracking-wide transition-all shadow-md shadow-neutral-900/20 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            For authorized personnel only. 
          </p>
        </div>

      </div>
    </div>
  );
}
