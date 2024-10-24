import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

describe('TicketTypeRequest', () => {
  test('should create a valid TicketTypeRequest', () => {
    const request = new TicketTypeRequest('ADULT', 2);
    expect(request.getTicketType()).toBe('ADULT');
    expect(request.getNoOfTickets()).toBe(2);
  });

  test('should throw error for invalid ticket type', () => {
    expect(() => new TicketTypeRequest('INVALID', 1))
      .toThrow(new InvalidPurchaseException('Type must be ADULT, CHILD, or INFANT'));
  });

  test('should throw error for non-integer ticket count', () => {
    expect(() => new TicketTypeRequest('ADULT', 'two'))
      .toThrow(new InvalidPurchaseException('Number of Tickets must be an integer'));
  });

  test('should throw error for negative ticket count', () => {
    expect(() => new TicketTypeRequest('ADULT', -2))
      .toThrow(new InvalidPurchaseException('Number of Tickets must be a positive integer'));
  });
});
