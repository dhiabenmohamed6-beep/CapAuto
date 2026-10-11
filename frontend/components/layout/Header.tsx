'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Heart, User, Menu, X, ChevronDown, LogOut,
  LayoutDashboard, Sun, Moon, MessageSquare, Settings, UserCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { localFavorites } from '@/lib/utils';
import { useMessageCount } from '@/lib/useMessageCount';

const NAV_LINKS = [
  { href: '/', label: 'ACCUEIL' },
  { href: '/vehicules', label: 'VÉHICULES' },
  { href: '/marques', label: 'NOS MARQUES' },
  { href: '/services', label: 'SERVICES' },
  { href: '/a-propos', label: 'À PROPOS' },
  { href: '/contact', label: 'CONTACT' },
];

/** Generates a consistent bg color from the user's name */
function avatarColor(name: string) {
  const colors = [
    'bg-red-500', 'bg-rose-500', 'bg-orange-500', 'bg-amber-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-blue-500', 'bg-violet-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { count: msgCount, markSeen } = useMessageCount(isAuthenticated, isAdmin);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setFavCount(localFavorites.get().length);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const displayName = user?.first_name || user?.username || 'Utilisateur';
  const initials = displayName.slice(0, 2).toUpperCase();
  const bgColor = avatarColor(displayName);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-black/10 dark:border-white/8 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3 group flex-shrink-0">
              <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-11 xl:h-11 bg-[#dc2626] rounded-lg flex items-center justify-center shadow-md group-hover:bg-[#ef4444] transition-colors duration-300">
                <span className="text-white font-black text-base lg:text-lg xl:text-xl tracking-tight">C</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 dark:text-white font-black tracking-[0.12em] text-xs sm:text-sm lg:text-base uppercase block leading-tight">
                  CapAuto
                </span>
                <span className="text-[#dc2626] text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.25em] uppercase font-medium block">
                  L&apos;excellence automobile
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 xl:px-4 py-2 text-[11px] xl:text-xs font-bold tracking-widest uppercase transition-colors duration-200 relative ${
                    isActive(href)
                      ? 'text-[#dc2626]'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#dc2626]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right side ── */}
            <div className="flex items-center gap-1 lg:gap-2">

              {/* Favorites icon */}
              <Link
                href="/mes-favoris"
                className="relative p-2 lg:p-2.5 text-gray-500 dark:text-gray-400 hover:text-[#dc2626] transition-colors"
                aria-label="Mes favoris"
              >
                <Heart className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-[#dc2626] rounded-full text-white text-[8px] lg:text-[9px] font-black flex items-center justify-center">
                    {favCount > 9 ? '9+' : favCount}
                  </span>
                )}
              </Link>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 lg:p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
                aria-label="Changer le thème"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 lg:w-5.5 lg:h-5.5" /> : <Moon className="w-5 h-5 lg:w-5.5 lg:h-5.5" />}
              </button>

              {/* Message bell — visible when logged in */}
              {isAuthenticated && (
                <Link
                  href={isAdmin ? '/admin/messages' : '/profil?tab=messages'}
                  onClick={markSeen}
                  className="relative p-2 lg:p-2.5 text-gray-500 dark:text-gray-400 hover:text-[#dc2626] transition-colors"
                  aria-label="Messages"
                >
                  <MessageSquare className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
                  {msgCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[14px] lg:min-w-[16px] h-3.5 lg:h-4 px-0.5 bg-[#dc2626] rounded-full text-white text-[8px] lg:text-[9px] font-black flex items-center justify-center animate-bounce">
                      {msgCount > 9 ? '9+' : msgCount}
                    </span>
                  )}
                </Link>
              )}

              {/* ── User area ── */}
{!loading && (
                isAuthenticated ? (
                  <div ref={menuRef} className="relative">
                    {/* Trigger button — avatar + name */}
                    <button
                      onClick={() => setUserMenuOpen(v => !v)}
                      className={`flex items-center gap-2 lg:gap-2.5 px-2 lg:px-3 py-1.5 lg:py-2 rounded-xl transition-all ${
                        userMenuOpen
                          ? 'bg-gray-100 dark:bg-white/8'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {/* Avatar circle with initials */}
                      <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                        <span className="text-white text-xs lg:text-sm font-black">{initials}</span>
                      </div>
                      {/* Name — hidden on small screens */}
                      <div className="hidden lg:flex flex-col items-start leading-tight">
                        <span className="text-gray-900 dark:text-white text-xs lg:text-sm font-bold truncate max-w-[100px] lg:max-w-[120px]">
                          {displayName}
                        </span>
                        <span className="text-gray-400 text-[9px] lg:text-[10px]">
                          {isAdmin ? 'Administrateur' : 'Membre'}
                        </span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* ── Dropdown ── */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 lg:w-64 bg-white dark:bg-[#16161a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-[fadeInUp_0.15s_ease_both]">

                        {/* Profile header */}
                        <div className="px-4 py-4 bg-gradient-to-br from-[#dc2626]/5 to-transparent border-b border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor} shadow-md`}>
                              <span className="text-white text-sm font-black">{initials}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-gray-900 dark:text-white font-bold text-sm truncate">{displayName}</p>
                              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                                isAdmin
                                  ? 'bg-[#dc2626]/10 text-[#dc2626]'
                                  : 'bg-gray-100 dark:bg-white/8 text-gray-500'
                              }`}>
                                {isAdmin ? 'Administrateur' : 'Membre'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="py-1.5">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-[#dc2626]/5 hover:text-[#dc2626] text-sm transition-colors group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[#dc2626]/10 flex items-center justify-center group-hover:bg-[#dc2626]/15 transition-colors">
                                <LayoutDashboard className="w-3.5 h-3.5 text-[#dc2626]" />
                              </div>
                              <span className="font-medium">Tableau de bord</span>
                            </Link>
                          )}

                          <Link
                            href="/profil"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white text-sm transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center">
                              <UserCircle className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <span className="font-medium">Mon profil</span>
                          </Link>

                          <Link
                            href="/mes-favoris"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white text-sm transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">Mes favoris</span>
                              {favCount > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-[#dc2626] text-white text-[10px] font-black rounded-full">
                                  {favCount}
                                </span>
                              )}
                            </div>
                          </Link>

                          <Link
                            href="/contact"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white text-sm transition-colors group"
                            onClick={markSeen}
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center relative">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">Mes messages</span>
                              {msgCount > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-[#dc2626] text-white text-[10px] font-black rounded-full">
                                  +{msgCount}
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>

                        {/* Divider + logout */}
                        <div className="border-t border-gray-100 dark:border-white/5 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                              <LogOut className="w-3.5 h-3.5 text-red-500" />
                            </div>
                            <span className="font-medium">Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/connexion"
                    className="hidden lg:flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 text-[11px] lg:text-xs rounded-xl font-black tracking-widest bg-[#dc2626] hover:bg-[#b91c1c] text-white transition-colors shadow-sm"
                  >
                    <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    CONNEXION
                  </Link>
                )
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Drawer ── */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-white dark:bg-[#111114] border-l border-black/10 dark:border-white/8 transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-black/5 dark:border-white/8">
            <span className="text-gray-900 dark:text-white font-black tracking-widest text-sm">MENU</span>
            <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors ${
                  isActive(href)
                    ? 'text-[#dc2626] bg-[#dc2626]/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-4 pb-6 border-t border-black/5 dark:border-white/8 pt-4">
            {isAuthenticated ? (
              <div className="space-y-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 dark:bg-white/5 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}>
                    <span className="text-white text-sm font-black">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 dark:text-white font-bold text-sm truncate">{displayName}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-[#dc2626]/5 hover:text-[#dc2626]">
                    <LayoutDashboard className="w-4 h-4 text-[#dc2626]" /> Tableau de bord
                  </Link>
                )}
                <Link href="/profil" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                  <UserCircle className="w-4 h-4 text-gray-500" /> Mon profil
                </Link>
                <Link href="/mes-favoris" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                  <Heart className="w-4 h-4 text-rose-500" /> Mes favoris
                  {favCount > 0 && <span className="ml-auto px-1.5 py-0.5 bg-[#dc2626] text-white text-[10px] font-black rounded-full">{favCount}</span>}
                </Link>
                <Link
                  href={isAdmin ? '/admin/messages' : '/profil'}
                  onClick={markSeen}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <MessageSquare className="w-4 h-4 text-blue-500" /> Mes messages
                  {msgCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 bg-[#dc2626] text-white text-[10px] font-black rounded-full">+{msgCount}</span>
                  )}
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/connexion" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black tracking-widest bg-[#dc2626] hover:bg-[#b91c1c] text-white transition-colors">
                <User className="w-4 h-4" /> CONNEXION / INSCRIPTION
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
