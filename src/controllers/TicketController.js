import TicketService from '../pairtest/TicketService.js';
import InvalidPurchaseException from '../pairtest/lib/InvalidPurchaseException.js';

export default class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  purchase = async (req, res) => {
    const { accountId, tickets } = req.body;

    if (!accountId || !tickets) {
      return res.status(400).json({ error: 'Invalid request: accountId and tickets are required' });
    }

    try {
      const { totalTickets, totalCost, totalSeats } = await this.ticketService.purchaseTickets(accountId, tickets);
      return res.status(200).json({ message: `${totalTickets} Tickets purchased successfully for ${totalCost}. ${totalSeats} seats are booked for you` });
    } catch (error) {
      if (error instanceof InvalidPurchaseException) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'An internal server error occurred' });
    }
  }
}
