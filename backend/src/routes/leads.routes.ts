import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leads.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate, leadValidation, updateLeadValidation } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export', exportLeadsCSV);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', validate(leadValidation), createLead);
router.put('/:id', validate(updateLeadValidation), updateLead);
router.delete('/:id', authorize('admin', 'sales'), deleteLead);

export default router;
