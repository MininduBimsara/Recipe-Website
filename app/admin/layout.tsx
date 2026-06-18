'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  // Bypasses the layout shell for the fullscreen login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-stone-50 min-h-screen text-espresso font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminHeader />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
