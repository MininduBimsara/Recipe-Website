'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Settings, 
  Utensils, 
  FileText, 
  Calendar, 
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  LayoutDashboard,
  ChefHat
} from 'lucide-react';

interface SidebarLink {
  href: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { href: '/admin', name: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/recipes', name: 'Recipes', icon: Utensils },
  { href: '/admin/blogs', name: 'Journals & Blogs', icon: FileText },
  { href: '/admin/media', name: 'Media Uploads', icon: ImageIcon },
  { href: '/admin/schedule', name: 'Publisher & Scheduler', icon: Calendar },
];

export default function AdminSidebar() {
  const pathname = usePathname() || '';

  const isLinkActive = (link: SidebarLink) => {
    if (link.exact) {
      return pathname === link.href;
    }
    return pathname.startsWith(link.href);
  };

  return (
    <aside className="w-64 border-r border-cream-dark bg-[#FCFAF7] h-screen flex flex-col justify-between p-6 sticky top-0" id="admin-console-sidebar">
      <div className="space-y-8">
        {/* Brand/Logo Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-cream-dark/60">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-cream-dark bg-white shrink-0">
            <Image 
              src="/logo.png" 
              alt="PebblePlate Logo" 
              fill 
              className="object-cover p-0.5" 
            />
          </div>
          <div className="text-left leading-tight">
            <h1 className="font-serif font-black text-sm text-espresso tracking-tight">PebblePlate</h1>
            <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider">CMS Console Desk</span>
          </div>
        </div>

        {/* Navigation Routes */}
        <nav className="space-y-1">
          <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-widest block pl-2 pb-2 text-left">
            Workspace
          </span>
          
          <ul className="space-y-1">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-espresso text-cream hover:bg-espresso-light shadow-3xs'
                        : 'text-stone-500 hover:text-espresso hover:bg-cream-light'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Utilities */}
      <div className="space-y-3 pt-6 border-t border-cream-dark/60">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 bg-white border border-cream-dark hover:border-stone-400 text-stone-500 hover:text-espresso rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch Site</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
