'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Car, Tag, Users, MessageSquare,
  Settings, LogOut, Bell, Search, Menu, X, 
  ChevronRight, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/Spinner';
import { messagesApi } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/vehicules', label: 'Véhicules', icon: Car },
  { href: '/admin/marques', label: 'Marques', icon: Tag },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/connexion');
  }, [loading, isAdmin, router]);

  // Fetch unread messages count
  useEffect(() => {
    if (isAdmin) {
      messagesApi.list().then(messages => {
        const count = messages.filter(m => !m.read).length;
        setUnreadCount(count);
      }).catch(() => setUnreadCount(0));
    }
  }, [isAdmin]);

  if (loading) return <PageLoader />;
  if (!isAdmin) return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-62 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ width: '240px' }}>
        
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#dc2626] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#b91c1c] transition-colors">
              <span className="text-white font-black text-base">C</span>
            </div>
            <div>
              <span className="text-gray-900 font-black tracking-wider text-sm uppercase block leading-tight">CapAuto</span>
              <span className="text-[#dc2626] text-[9px] tracking-widest uppercase font-medium">Administration</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase px-3 mb-3">Principal</p>
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive(href, exact)
                  ? 'bg-[#dc2626]/10 text-[#dc2626] border-l-2 border-[#dc2626]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {href === '/admin/messages' && unreadCount > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-[#dc2626] text-white text-[10px] font-black rounded-full min-w-[1.25rem] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              {isActive(href, exact) && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          ))}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase px-3 mb-3">Système</p>
            <Link
              href="/admin/parametres"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive('/admin/parametres')
                  ? 'bg-[#dc2626]/10 text-[#dc2626] border-l-2 border-[#dc2626]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              Paramètres
            </Link>
            <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              Voir le site
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">{user?.first_name?.[0] || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-xs font-bold truncate">{user?.first_name || user?.username}</p>
              <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Déconnexion">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 focus:border-[#dc2626] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notification bell */}
            <button className="relative p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            </button>

            {/* User badge */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-[#dc2626] flex items-center justify-center">
                <span className="text-white text-xs font-black">{user?.first_name?.[0] || 'A'}</span>
              </div>
              <span className="text-gray-700 text-sm font-semibold">{user?.first_name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
