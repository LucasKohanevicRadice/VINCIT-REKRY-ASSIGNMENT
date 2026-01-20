import request from 'supertest';
import app from '../../src/app';
import { bookingDb } from '../../src/database/inMemoryDb';

describe('Booking API', () => {
  beforeEach(() => {
    bookingDb.clearBookings();
  });

  const validBooking = () => {
    const start = new Date(Date.now() + 86400000);
    const end = new Date(start.getTime() + 3600000);
    return {
      roomId: 'room-1',
      userId: 'user-1',
      userEmail: 'test@example.com',
      title: 'Meeting',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
  };

  describe('POST /api/bookings', () => {
    it('creates booking successfully', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send(validBooking())
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.roomName).toBe('Neuvotteluhuone A');
    });

    it('returns 400 for validation errors', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({ roomId: 'room-1' })
        .expect(400);

      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 409 for overlapping booking', async () => {
      await request(app).post('/api/bookings').send(validBooking());

      await request(app).post('/api/bookings').send(validBooking()).expect(409);
    });

    it('returns 404 for non-existent room', async () => {
      const booking = { ...validBooking(), roomId: 'room-999' };

      await request(app).post('/api/bookings').send(booking).expect(404);
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('deletes booking successfully', async () => {
      const created = await request(app)
        .post('/api/bookings')
        .send(validBooking());

      await request(app).delete(`/api/bookings/${created.body.id}`).expect(204);
    });

    it('returns 404 for non-existent booking', async () => {
      await request(app).delete('/api/bookings/non-existent').expect(404);
    });
  });

  describe('GET /api/rooms/:roomId/bookings', () => {
    it('returns bookings for room', async () => {
      await request(app).post('/api/bookings').send(validBooking());

      const res = await request(app)
        .get('/api/rooms/room-1/bookings')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].roomName).toBe('Neuvotteluhuone A');
    });

    it('returns 404 for non-existent room', async () => {
      await request(app).get('/api/rooms/room-999/bookings').expect(404);
    });
  });
});
