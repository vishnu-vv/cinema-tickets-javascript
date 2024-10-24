import TicketService from '../pairtest/TicketService.js';

export default class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  purchase = async (req, res) => {
    const { accountId, tickets } = req.body;

    try {
      this.ticketService.purchaseTickets(accountId, tickets);
      return res.status(200).json({ message: 'Tickets purchased successfully' });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  }
}
