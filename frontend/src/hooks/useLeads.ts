import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadsService } from '../services/leads.service';
import toast from 'react-hot-toast';

export function useLeads(filters: LeadFilters) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await leadsService.getLeads(filters);
      if (res.success && res.data) {
        setLeads(res.data);
        setMeta(res.meta || null);
      }
    } catch {
      setError('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const deleteLead = async (id: string) => {
    try {
      await leadsService.deleteLead(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  return { leads, meta, isLoading, error, refetch: fetchLeads, deleteLead };
}
