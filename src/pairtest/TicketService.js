import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

/* Sample Ticket Request
{ 
  accountId,
  tickets: {
    'ADULT': 2,
    'CHILD': 1,
    'INFANT': 1
  }
}
*/

const TICKET_PRICES = {
  INFANT: 0,
  CHILD: 15,
  ADULT: 25,
};

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  async purchaseTickets(accountId, tickets) {
    const ticketTypeRequests = this.#initializeTicketRequests(tickets);

    const totalTickets = this.#getTotalTickets(ticketTypeRequests);

    return totalTickets;
  }

  #initializeTicketRequests(tickets) {
    return Object.entries(tickets).map(([type, count]) => {
      return new TicketTypeRequest(type, count);
    });
  }

  #getTotalTickets(ticketTypeRequests) {
    return ticketTypeRequests.reduce((sum, request) => sum + request.getNoOfTickets(), 0);
  }
}
