import React from 'react';
import { Users, TrendingUp, Target, XCircle } from 'lucide-react';
import { LeadStats } from '../../types';

interface StatsCardsProps {
  stats: LeadStats | null;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const getCount = (id: string) =>
    stats?.statusStats.find((s) => s._id === id)?.count || 0;

  const cards = [
    {
      label: 'Total Leads',
      value: stats?.totalCount || 0,
      icon: Users,
      color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/20',
    },
    {
      label: 'Qualified',
      value: getCount('Qualified'),
      icon: Target,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Contacted',
      value: getCount('Contacted'),
      icon: TrendingUp,
      color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      label: 'Lost',
      value: getCount('Lost'),
      icon: XCircle,
      color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 mb-3" />
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-4 animate-fade-in">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
            <card.icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
            {card.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
};
