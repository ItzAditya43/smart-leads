import React from 'react';
import { Pencil, Trash2, Mail, Calendar } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onView }) => {
  const createdAt = new Date(lead.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="card p-4 hover:shadow-md transition-all cursor-pointer group animate-fade-in"
      onClick={() => onView(lead)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {lead.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lead.email}</p>
              </div>
            </div>
            {/* Actions */}
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(lead)}
                className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-400 hover:text-brand-600 transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(lead._id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
            <div className="flex items-center gap-1 ml-auto">
              <Calendar className="w-3 h-3 text-gray-300 dark:text-gray-600" />
              <span className="text-xs text-gray-400">{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
