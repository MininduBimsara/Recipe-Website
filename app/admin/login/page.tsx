'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Lock, Mail } from 'lucide-react';
import { signInAction } from '@/lib/actions/auth';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (failedAttempts >= 5) {
      setError('Too many attempts. Try again in 15 minutes.');
      toast.error('Account lock active. Rate limit reached.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signInAction(email, password);
    setLoading(false);

    if (res.success) {
      toast.success('Successfully authenticated.');
      router.push('/admin');
      router.refresh();
    } else {
      setError(res.error || 'Incorrect email or password');
      setFailedAttempts(prev => prev + 1);
      toast.error('Authentication failed');
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center items-center px-4 py-12 animate-fade-in" id="login-container">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl" id="login-card">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-[#E6D5C3]/10 text-[#E6D5C3] rounded-2xl mb-4">
            <ChefHat className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-[#E6D5C3] tracking-wide">
            Savory Kitchen
          </h1>
          <p className="text-xs font-mono tracking-widest text-stone-400 mt-2 uppercase">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-955/40 border border-red-800/60 rounded-xl p-4 text-xs text-red-300 text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-bold tracking-wider text-stone-400 mb-2 uppercase">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="chef@pebbleplate.page"
                className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 focus:border-[#E6D5C3] focus:ring-1 focus:ring-[#E6D5C3] rounded-xl text-sm text-stone-100 placeholder-stone-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold tracking-wider text-stone-400 mb-2 uppercase">
              Passcode
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 focus:border-[#E6D5C3] focus:ring-1 focus:ring-[#E6D5C3] rounded-xl text-sm text-stone-100 placeholder-stone-600 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E6D5C3] hover:bg-[#D4C3B1] disabled:bg-stone-700 text-stone-950 font-bold font-serif rounded-xl text-sm tracking-wide transition shadow-lg shadow-black/40 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] font-mono text-stone-500" id="login-footer">
          Protected Administrative Gateway. Unauthorized access is prohibited.
        </div>
      </div>
    </div>
  );
}
