import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

const TICKET_PRICES = {
  INFANT: 0,
  CHILD: 15,
  ADULT: 25,
};

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   * purchaseTickets(accountId, tickets)
   * 
   * Sample Ticket Request
   * 
   * { 
   *   accountId,
   *   tickets: {
   *     'ADULT': 2,
   *     'CHILD': 1,
   *     'INFANT': 1
   *   }
   * }
   */

  constructor() {
    this.ticketPaymentService = new TicketPaymentService();
    this.seatReservationService = new SeatReservationService();
  }

  async purchaseTickets(accountId, tickets) {
    if (!accountId || !tickets) {
      throw new InvalidPurchaseException('Invalid purchase request: accountId and tickets are required');
    }

    if (accountId <= 0) {
      throw new InvalidPurchaseException('Invalid Account ID');
    }

    const ticketEntries = Object.entries(tickets);

    if (ticketEntries.length === 0) {
      throw new InvalidPurchaseException('Ticket param cannot be empty');
    }

    const ticketTypeRequests = this.#initializeTicketRequests(ticketEntries);

    this.#validateTicketRequests(ticketTypeRequests);

    const totalTickets = this.#getTotalTickets(ticketTypeRequests);
    if (totalTickets > 25) {
      throw new InvalidPurchaseException('Cannot purchase more than 25 tickets');
    }

    const totalCost = this.#calculateTotalCost(ticketTypeRequests);
    const totalSeats = this.#calculateTotalSeats(ticketTypeRequests);

    this.#makePayment(accountId, totalCost);
    this.#reserveSeats(accountId, totalSeats);

    return { totalTickets, totalCost, totalSeats };
  }

  #initializeTicketRequests(tickets) {
    return tickets.map(([type, count]) => {
      return new TicketTypeRequest(type, count);
    });
  }

  #validateTicketRequests(ticketTypeRequests) {
    let hasAdult = false;

    hasAdult = ticketTypeRequests.some(request => request.getTicketType() === 'ADULT' && request.getNoOfTickets() > 0);

    if (!hasAdult) {
      throw new InvalidPurchaseException('At least one adult ticket is required');
    }
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

  #makePayment(accountId, totalCost) {
    this.ticketPaymentService.makePayment(accountId, totalCost);
  }

  #reserveSeats(accountId, totalSeats) {
    this.seatReservationService.reserveSeat(accountId, totalSeats);
  }
}
