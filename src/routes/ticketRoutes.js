import express from 'express';
import TicketController from '../controllers/TicketController.js';

const ticketController = new TicketController();

const router = express.Router();

router.post('/purchase', ticketController.purchase);

export default router;