'use client';

import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Shield } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { signOutAction } from '@/lib/actions/auth';

export default function AdminHeader() {
  const [isSupabase, setIsSupabase] = useState(false);

  useEffect(() => {
    setIsSupabase(isSupabaseConfigured());
  }, []);

  return (
    <header className="h-16 border-b border-cream-dark bg-white/70 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30" id="admin-console-header">
      {/* Telemetry Status */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
          isSupabase 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
            : 'bg-[#B35C2E]/10 text-terracotta border-orange-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
          {isSupabase ? 'SUPABASE SECURE LIVE STORAGE' : 'LOCAL OFFLINE DEVELOPMENT MODE'}
        </span>
      </div>

      {/* Profile & Control actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 border-r border-cream-dark pr-4">
          <Shield className="w-3.5 h-3.5 text-sage" />
          <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">
            Editor Room
          </span>
        </div>

        <button 
          onClick={() => signOutAction()}
          className="px-3 py-1.5 bg-stone-900 border border-stone-850 text-[#E6D5C3] font-mono hover:bg-stone-800 font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 text-[10px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}
