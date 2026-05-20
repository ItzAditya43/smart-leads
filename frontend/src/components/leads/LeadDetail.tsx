import React from 'react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Mail, Calendar, User, FileText, Pencil } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
  onEdit: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onEdit }) => {
  const createdAt = new Date(lead.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedAt = new Date(lead.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const createdByName =
    typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-lg font-semibold">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            {lead.email}
          </p>
        </div>
        <button onClick={onEdit} className="btn-primary flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status={lead.status} />
        <SourceBadge source={lead.source} />
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-gray-800 dark:text-gray-200">{createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="text-gray-800 dark:text-gray-200">{updatedAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-gray-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Created By</p>
            <p className="text-gray-800 dark:text-gray-200">{createdByName}</p>
          </div>
        </div>

        {lead.notes && (
          <div className="flex gap-3 text-sm">
            <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                {lead.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
