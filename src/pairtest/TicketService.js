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
    if (accountId <= 0) {
      throw new InvalidPurchaseException('Invalid Account ID');
    }

    const ticketTypeRequests = this.#initializeTicketRequests(tickets);

    const totalTickets = this.#getTotalTickets(ticketTypeRequests);
    const totalCost = this.#calculateTotalCost(ticketTypeRequests);
    const totalSeats = this.#calculateTotalSeats(ticketTypeRequests);

    return { totalTickets, totalCost, totalSeats };
  }

  #initializeTicketRequests(tickets) {
    return Object.entries(tickets).map(([type, count]) => {
      return new TicketTypeRequest(type, count);
    });
  }

  #getTotalTickets(ticketTypeRequests) {
    return ticketTypeRequests.reduce((sum, request) => sum + request.getNoOfTickets(), 0);
  }

  #calculateTotalCost(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => {
      return total + (TICKET_PRICES[request.getTicketType().toUpperCase()] * request.getNoOfTickets());
    }, 0);
  }

  #calculateTotalSeats(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => {
      if (request.getTicketType().toUpperCase() !== 'INFANT') {
        return total + request.getNoOfTickets();
      }
      return total;
    }, 0);
  }
}
