import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function registerFounder(formData: FormData) {
  'use server';
  const email = formData.get('email');
  const password = formData.get('password');

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    redirect('/login');
  }
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-white">
      <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl border border-neutral-800 p-8 relative overflow-hidden">
        
        {/* Subtle Gold Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Initialize SHAKTI</h1>
          <p className="text-sm text-[#D4AF37] tracking-wide uppercase">Founder Setup</p>
        </div>

        <form action={registerFounder} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider" htmlFor="email">
              Founder Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-white transition-colors"
              placeholder="founder@shakti.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider" htmlFor="password">
              Secure Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#C5A030] text-black rounded-lg font-semibold tracking-wide transition-all shadow-lg shadow-[#D4AF37]/20 active:scale-[0.98]"
          >
            Create Founder Account
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center relative z-10">
          <p className="text-xs text-neutral-500">
            This page will lock automatically after the first registration.
          </p>
        </div>

      </div>
    </div>
  );
}
