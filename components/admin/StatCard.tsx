'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
  trend?: string;
}

export default function StatCard({ title, value, icon: Icon, loading = false, trend }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-cream-dark shadow-3xs flex flex-col justify-between text-left relative overflow-hidden transition-all hover:border-stone-400 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
          {title}
        </span>
        <div className="p-2 bg-cream text-espresso group-hover:bg-terracotta/5 group-hover:text-terracotta rounded-xl transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        {loading ? (
          <div className="h-8 w-20 bg-stone-100 animate-pulse rounded-lg" />
        ) : (
          <h3 className="font-serif font-black text-2xl text-espresso tracking-tight">
            {value}
          </h3>
        )}
        
        {trend && !loading && (
          <p className="text-[9px] font-mono text-sage font-semibold uppercase tracking-wider">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
