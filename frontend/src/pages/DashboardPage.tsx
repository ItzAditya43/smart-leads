import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { Lead, LeadFilters } from '../types';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { leadsService } from '../services/leads.service';
import { LeadCard } from '../components/leads/LeadCard';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetail } from '../components/leads/LeadDetail';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { StatsCards } from '../components/leads/StatsCards';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Loader';
import { LeadStats } from '../types';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const activeFilters = { ...filters, search: debouncedSearch || undefined, page: filters.page };
  const { leads, meta, isLoading, error, refetch, deleteLead } = useLeads(activeFilters);

  useEffect(() => {
    setFilters((f) => ({ ...f, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    leadsService.getStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
      setStatsLoading(false);
    });
  }, [leads]);

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ sort: 'latest', page: 1, limit: 10 });
    setSearchInput('');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadsService.exportCSV({ ...filters, search: debouncedSearch });
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this lead?')) {
      await deleteLead(id);
    }
  };

  const handleFormSuccess = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingLead(null);
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and track your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-ghost flex items-center gap-1.5 border border-gray-200 dark:border-gray-700"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Lead</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} isLoading={statsLoading} />

      {/* Filters */}
      <div className="card p-4">
        <LeadFiltersBar
          filters={filters}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Leads list */}
      <div>
        {isLoading ? (
          <PageLoader />
        ) : error ? (
          <div className="card p-8 text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={refetch} className="btn-primary mt-3">Retry</button>
          </div>
        ) : leads.length === 0 ? (
          <div className="card">
            <EmptyState
              title={debouncedSearch || filters.status || filters.source ? 'No leads found' : 'No leads yet'}
              description={
                debouncedSearch || filters.status || filters.source
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first lead to get started'
              }
              icon={debouncedSearch || filters.status || filters.source ? 'search' : 'users'}
              action={
                !debouncedSearch && !filters.status && !filters.source ? (
                  <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    Add your first lead
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
            {meta && (
              <div className="mt-4">
                <Pagination
                  meta={meta}
                  onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Lead">
        <LeadForm onSuccess={handleFormSuccess} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Lead">
        {editingLead && (
          <LeadForm
            lead={editingLead}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Lead Details" size="lg">
        {selectedLead && (
          <LeadDetail lead={selectedLead} onEdit={() => handleEdit(selectedLead)} />
        )}
      </Modal>
    </div>
  );
};
