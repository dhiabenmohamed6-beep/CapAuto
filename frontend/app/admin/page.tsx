'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car, TrendingUp, Eye, MessageSquare, Plus, ArrowRight,
  Activity, TrendingDown, Tag
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { dashboardApi } from '@/lib/api';
import { DashboardStats, ActivityItem } from '@/types';
import { formatNumber, timeAgo } from '@/lib/utils';

const RED = '#dc2626';
const COLORS = ['#dc2626', '#ef4444', '#b91c1c', '#f87171', '#991b1b', '#fca5a5', '#7f1d1d', '#fee2e2'];

function StatCard({ icon: Icon, label, value, sub, trend, color = RED }: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
  trend?: 'up' | 'down';
  color?: string;
}) {
  const isRed = color === RED;
  const isGreen = color === '#22c55e';
  const isBlue = color === '#3b82f6';
  const iconBg = isRed ? 'bg-red-50' : isGreen ? 'bg-green-50' : isBlue ? 'bg-blue-50' : 'bg-amber-50';
  const iconColor = isRed ? 'text-[#dc2626]' : isGreen ? 'text-green-600' : isBlue ? 'text-blue-600' : 'text-amber-600';
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend === 'up' ? '+12%' : '-3%'}
          </span>
        )}
      </div>
      <div className="text-3xl font-black text-gray-900 mb-1">{typeof value === 'number' ? formatNumber(value) : value}</div>
      <div className="text-gray-500 text-sm font-medium">{label}</div>
      {sub && <div className="text-gray-400 text-xs mt-1">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; value: number; color: string}>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-lg">
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [salesData, setSalesData] = useState<{ months: string[]; sales: number[]; listings: number[] } | null>(null);
  const [brandData, setBrandData] = useState<{ brand: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.stats(),
      dashboardApi.activity(),
      dashboardApi.salesChart(),
      dashboardApi.brandDistribution(),
    ]).then(([s, a, sc, bd]) => {
      setStats(s);
      setActivity(a);
      setSalesData(sc);
      setBrandData(bd);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = salesData ? salesData.months.map((m, i) => ({
    month: m,
    Ventes: salesData.sales[i],
    Annonces: salesData.listings[i],
  })) : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-[#dc2626] rounded-full" />
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Tableau de bord</h1>
          </div>
          <p className="text-gray-400 text-sm pl-3">Vue d&apos;ensemble de votre activité CapAuto</p>
        </div>
        <Link
          href="/admin/vehicules/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black tracking-wide bg-[#dc2626] hover:bg-[#b91c1c] text-white transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          AJOUTER UN VÉHICULE
        </Link>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-6">
        <StatCard icon={Car} label="Véhicules actifs" value={stats?.vehicules_actifs || 0} sub="Annonces publiées" trend="up" />
        <StatCard icon={TrendingUp} label="Véhicules vendus" value={stats?.vehicules_vendus || 0} sub="Total cumulé" color="#22c55e" trend="up" />
        <StatCard icon={Eye} label="Vues catalogue" value={stats?.vues_catalogue || 0} sub="Ce mois" color="#3b82f6" trend="up" />
        <StatCard icon={MessageSquare} label="Demandes clients" value={stats?.demandes_clients || 0} sub={`${stats?.demandes_non_lues || 0} non lues`} color="#f59e0b" trend="up" />
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: 'Total véhicules', value: stats?.vehicules_total || 0, icon: Car },
          { label: 'En brouillon', value: stats?.vehicules_brouillon || 0, icon: Activity },
          { label: 'Réservés', value: stats?.vehicules_reserves || 0, icon: Activity },
          { label: 'Vendus', value: stats?.vehicules_vendus || 0, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl px-3 lg:px-4 py-2.5 lg:py-3 flex items-center gap-2 lg:gap-3">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-900 font-bold text-base lg:text-lg">{loading ? '…' : formatNumber(value)}</p>
              <p className="text-gray-400 text-[10px] lg:text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 font-bold">Évolution des annonces &amp; ventes</h2>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded-md">12 derniers mois</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Annonces" stroke={RED} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Ventes" stroke="#22c55e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 text-sm">Chargement…</div>
          )}
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#dc2626] block" /><span className="text-gray-400 text-xs">Annonces</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-green-500 block" /><span className="text-gray-400 text-xs">Ventes</span></div>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-gray-900 font-bold mb-6">Répartition par marque</h2>
          {brandData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={brandData} dataKey="count" nameKey="brand" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {brandData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">Chargement…</div>
          )}
          <div className="space-y-2 mt-4">
            {brandData.slice(0, 5).map(({ brand, count }, i) => (
              <div key={brand} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-500 text-xs">{brand}</span>
                </div>
                <span className="text-gray-900 text-xs font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity + Quick actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-gray-900 font-bold text-base lg:text-lg">Activité récente</h2>
            <Activity className="w-4 h-4 text-gray-300" />
          </div>
          <div className="space-y-1">
            {activity.length === 0 && loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 lg:gap-3 py-2">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))
            ) : activity.map((item, i) => (
              <div key={i} className="flex items-start gap-2 lg:gap-3 py-2 lg:py-2.5 border-b border-gray-50 last:border-0">
                <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'vehicle' ? 'bg-red-50 text-[#dc2626]' : 'bg-blue-50 text-blue-500'}`}>
                  {item.type === 'vehicle' ? <Car className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-xs lg:text-sm font-medium truncate">{item.label}</p>
                  <p className="text-gray-400 text-[10px] lg:text-xs mt-0.5 truncate">
                    {item.vehicle && <span>{item.vehicle}</span>}
                    {item.from && <span> · De: {item.from}</span>}
                  </p>
                </div>
                <span className="text-gray-300 text-[10px] lg:text-xs flex-shrink-0">{timeAgo(item.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">
          <h2 className="text-gray-900 font-bold text-base lg:text-lg mb-4 lg:mb-6">Actions rapides</h2>
          <div className="space-y-2 lg:space-y-2.5">
            {[
              { href: '/admin/vehicules/nouveau', label: 'Ajouter un véhicule', icon: Car, bg: 'bg-red-50', color: 'text-[#dc2626]' },
              { href: '/admin/vehicules', label: 'Gérer les véhicules', icon: Car, bg: 'bg-blue-50', color: 'text-blue-500' },
              { href: '/admin/marques', label: 'Gérer les marques', icon: Tag, bg: 'bg-purple-50', color: 'text-purple-500' },
              { href: '/admin/messages', label: 'Voir les messages', icon: MessageSquare, bg: 'bg-amber-50', color: 'text-amber-500' },
            ].map(({ href, label, icon: Icon, bg, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 lg:gap-3 p-2.5 lg:p-3 rounded-xl border border-gray-100 hover:border-[#dc2626]/30 hover:bg-red-50/30 transition-all group"
              >
                <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                  <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${color}`} />
                </div>
                <span className="text-gray-600 text-xs lg:text-sm font-medium group-hover:text-gray-900 transition-colors flex-1 truncate">{label}</span>
                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-[#dc2626] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>

          {/* CapAuto branding block */}
          <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-[#dc2626] rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-[#dc2626] font-black text-[10px] lg:text-xs">C</span>
              </div>
              <span className="font-black text-xs lg:text-sm tracking-wide">CapAuto</span>
            </div>
            <p className="text-white/80 text-[10px] lg:text-xs leading-relaxed">
              Tableau de bord administrateur — Gérez votre catalogue et suivez votre activité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
