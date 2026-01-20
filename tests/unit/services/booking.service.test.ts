import {
  createBooking,
  deleteBooking,
  getBookingsByRoomId,
} from '../../../src/services/booking.service';
import { bookingDb } from '../../../src/database/inMemoryDb';
import { NotFoundError, ConflictError } from '../../../src/errors/customErrors';

describe('booking.service', () => {
  beforeEach(() => {
    bookingDb.clearBookings();
  });

  const validDto = () => {
    const start = new Date(Date.now() + 86400000); // huomenna
    const end = new Date(start.getTime() + 3600000); // +1h
    return {
      roomId: 'room-1',
      userId: 'user-1',
      userEmail: 'test@example.com',
      title: 'Palaveri',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
  };

  describe('createBooking', () => {
    it('creates booking and returns response with roomName', () => {
      const result = createBooking(validDto());

      expect(result.id).toBeDefined();
      expect(result.roomName).toBe('Neuvotteluhuone A');
      expect(result.title).toBe('Palaveri');
    });

    it('throws NotFoundError for non-existent room', () => {
      const dto = { ...validDto(), roomId: 'room-999' };

      expect(() => createBooking(dto)).toThrow(NotFoundError);
    });

    it('throws ConflictError for overlapping booking', () => {
      createBooking(validDto());

      expect(() => createBooking(validDto())).toThrow(ConflictError);
    });
  });

  describe('deleteBooking', () => {
    it('deletes existing booking', () => {
      const booking = createBooking(validDto());

      deleteBooking(booking.id);

      expect(bookingDb.getBookingById(booking.id)).toBeNull();
    });

    it('throws NotFoundError for non-existent booking', () => {
      expect(() => deleteBooking('non-existent-id')).toThrow(NotFoundError);
    });
  });

  describe('getBookingsByRoomId', () => {
    it('returns bookings for room', () => {
      createBooking(validDto());

      const result = getBookingsByRoomId('room-1');

      expect(result).toHaveLength(1);
      expect(result[0].roomName).toBe('Neuvotteluhuone A');
    });

    it('throws NotFoundError for non-existent room', () => {
      expect(() => getBookingsByRoomId('room-999')).toThrow(NotFoundError);
    });
  });
});
