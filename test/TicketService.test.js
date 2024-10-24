import TicketService from '../src/pairtest/TicketService.js';
import TicketPaymentService from '../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../src/thirdparty/seatbooking/SeatReservationService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

jest.mock('../src/thirdparty/paymentgateway/TicketPaymentService.js');
jest.mock('../src/thirdparty/seatbooking/SeatReservationService.js');
jest.mock('../src/pairtest/lib/TicketTypeRequest.js');

describe('TicketService', () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  test('should throw InvalidPurchaseException for missing accountId', async () => {
    await expect(ticketService.purchaseTickets(null, { ADULT: 2 }))
      .rejects
      .toThrow(new InvalidPurchaseException('Invalid purchase request: accountId and tickets are required'));
  });

  test('should throw InvalidPurchaseException for empty ticket object', async () => {
    await expect(ticketService.purchaseTickets(1, {}))
      .rejects
      .toThrow(new InvalidPurchaseException('Ticket param cannot be empty'));
  });

  test('should process tickets and call payment and seat reservation services', async () => {
    TicketTypeRequest.mockImplementation((type, count) => ({
      getTicketType: () => type,
      getNoOfTickets: () => count,
    }));

    await ticketService.purchaseTickets(1, { ADULT: 2, CHILD: 1 });

    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(1, 65);
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(1, 3);
  });

  test('should throw InvalidPurchaseException for more than 25 tickets', async () => {
    const tooManyTickets = { ADULT: 26 };

    await expect(ticketService.purchaseTickets(1, tooManyTickets))
      .rejects
      .toThrow(new InvalidPurchaseException('Cannot purchase more than 25 tickets'));
  });

  test('should calculate total tickets, cost, and seats correctly', async () => {
    TicketTypeRequest.mockImplementation((type, count) => ({
      getTicketType: () => type,
      getNoOfTickets: () => count,
    }));

    const result = await ticketService.purchaseTickets(1, { ADULT: 2, CHILD: 1 });

    expect(result.totalTickets).toBe(3);
    expect(result.totalCost).toBe(65);
    expect(result.totalSeats).toBe(3);
  });
});
