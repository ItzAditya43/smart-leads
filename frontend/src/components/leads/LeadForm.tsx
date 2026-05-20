import React, { useState } from 'react';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '../../types';
import { leadsService } from '../../services/leads.service';
import { Loader } from '../ui/Loader';
import toast from 'react-hot-toast';

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<LeadFormData>({
    name: lead?.name || '',
    email: lead?.email || '',
    status: lead?.status || 'New',
    source: lead?.source || 'Website',
    notes: lead?.notes || '',
  });

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'Enter a valid email';
    if (!form.source) errs.source = 'Source is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (lead) {
        await leadsService.updateLead(lead._id, form);
        toast.success('Lead updated successfully');
      } else {
        await leadsService.createLead(form);
        toast.success('Lead created successfully');
      }
      onSuccess();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Full Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`input-base ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Email *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`input-base ${errors.email ? 'border-red-400' : ''}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Status
          </label>
          <select name="status" value={form.status} onChange={handleChange} className="input-base">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Source *
          </label>
          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className={`input-base ${errors.source ? 'border-red-400' : ''}`}
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.source && <p className="text-xs text-red-500 mt-1">{errors.source}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          Notes
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional notes..."
          className="input-base resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.notes?.length || 0}/500</p>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting && <Loader size="sm" />}
          {lead ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};
