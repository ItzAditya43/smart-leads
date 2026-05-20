import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

interface SourceBadgeProps {
  source: LeadSource;
}

const statusConfig: Record<LeadStatus, { label: string; classes: string }> = {
  New: { label: 'New', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  Contacted: { label: 'Contacted', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  Qualified: { label: 'Qualified', classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  Lost: { label: 'Lost', classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

const sourceConfig: Record<LeadSource, { label: string; classes: string }> = {
  Website: { label: 'Website', classes: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  Instagram: { label: 'Instagram', classes: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
  Referral: { label: 'Referral', classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`badge ${config.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
};

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => {
  const config = sourceConfig[source];
  return <span className={`badge ${config.classes}`}>{config.label}</span>;
};
