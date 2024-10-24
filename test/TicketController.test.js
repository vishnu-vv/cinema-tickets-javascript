import TicketService from '../src/pairtest/TicketService.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';
import TicketController from '../src/controllers/TicketController.js';

jest.mock('../src/pairtest/TicketService.js');

describe('TicketController', () => {
  let ticketController;
  let req, res;

  beforeEach(() => {
    ticketController = new TicketController();
    req = { body: { accountId: 1, tickets: { ADULT: 2, CHILD: 1 } } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test('should return 200 and success message on valid purchase', async () => {
    TicketService.prototype.purchaseTickets.mockResolvedValue({
      totalTickets: 3,
      totalCost: 65,
      totalSeats: 3,
    });

    await ticketController.purchase(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: '3 Tickets purchased successfully for 65. 3 seats are booked for you',
    });
  });

  test('should return 400 on InvalidPurchaseException', async () => {
    TicketService.prototype.purchaseTickets.mockRejectedValue(new InvalidPurchaseException('Invalid purchase request'));

    await ticketController.purchase(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid purchase request' });
  });

  test('should return 500 on internal server error', async () => {
    TicketService.prototype.purchaseTickets.mockRejectedValue(new Error('Unexpected error'));

    await ticketController.purchase(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An internal server error occurred' });
  });
});
