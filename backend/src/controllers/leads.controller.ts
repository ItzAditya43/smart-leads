import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user!.id });
    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create lead', 500);
  }
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadFilters;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query: FilterQuery<ILeadDocument> = {};

    // Role-based: sales users see only their leads
    if (req.user!.role === 'sales') {
      query.createdBy = req.user!.id;
    }

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status as string)) {
      query.status = status as LeadStatus;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source as string)) {
      query.source = source as LeadSource;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, leads, 'Leads fetched successfully', 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch {
    sendError(res, 'Failed to fetch leads', 500);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: FilterQuery<ILeadDocument> = { _id: req.params.id };
    if (req.user!.role === 'sales') {
      query.createdBy = req.user!.id;
    }

    const lead = await Lead.findOne(query).populate('createdBy', 'name email');
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }
    sendSuccess(res, lead, 'Lead fetched successfully');
  } catch {
    sendError(res, 'Failed to fetch lead', 500);
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: FilterQuery<ILeadDocument> = { _id: req.params.id };
    if (req.user!.role === 'sales') {
      query.createdBy = req.user!.id;
    }

    const lead = await Lead.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found or access denied', 404);
      return;
    }
    sendSuccess(res, lead, 'Lead updated successfully');
  } catch {
    sendError(res, 'Failed to update lead', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: FilterQuery<ILeadDocument> = { _id: req.params.id };
    if (req.user!.role === 'sales') {
      query.createdBy = req.user!.id;
    }

    const lead = await Lead.findOneAndDelete(query);
    if (!lead) {
      sendError(res, 'Lead not found or access denied', 404);
      return;
    }
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch {
    sendError(res, 'Failed to delete lead', 500);
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as Partial<LeadFilters>;

    const query: FilterQuery<ILeadDocument> = {};
    if (req.user!.role === 'sales') {
      query.createdBy = req.user!.id;
    }
    if (status) query.status = status as LeadStatus;
    if (source) query.source = source as LeadSource;
    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');

    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'];
    const rows = leads.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      l.status,
      l.source,
      `"${l.notes || ''}"`,
      `"${(l.createdBy as { name?: string })?.name || ''}"`,
      new Date(l.createdAt).toISOString().split('T')[0],
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch {
    sendError(res, 'Failed to export leads', 500);
  }
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const matchStage = req.user!.role === 'sales' ? { createdBy: req.user!.id } : {};

    const [statusStats, sourceStats, totalCount] = await Promise.all([
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(matchStage),
    ]);

    sendSuccess(res, { totalCount, statusStats, sourceStats }, 'Stats fetched successfully');
  } catch {
    sendError(res, 'Failed to fetch stats', 500);
  }
};
