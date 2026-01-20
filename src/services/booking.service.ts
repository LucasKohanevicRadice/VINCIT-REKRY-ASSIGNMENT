import { v4 as uuidv4 } from 'uuid';
import { Booking, CreateBookingDto, BookingResponse } from '../models/booking.model';
import { bookingDb } from '../database/inMemoryDb';
import { getRoomById } from './room.service';
import { NotFoundError, ConflictError } from '../errors/customErrors';
import { parseIsoDate, doTimeRangesOverlap, toIsoString } from '../utils/dateUtils';

function toBookingResponse(booking: Booking, roomName: string): BookingResponse {
  return {
    id: booking.id,
    roomId: booking.roomId,
    roomName,
    userId: booking.userId,
    userEmail: booking.userEmail,
    title: booking.title,
    startTime: toIsoString(booking.startTime),
    endTime: toIsoString(booking.endTime),
    createdAt: toIsoString(booking.createdAt),
  };
}

function hasOverlappingBooking(roomId: string, startTime: Date, endTime: Date): boolean {
  const roomBookings = bookingDb.getByRoomId(roomId);
  return roomBookings.some(existing =>
    doTimeRangesOverlap(startTime, endTime, existing.startTime, existing.endTime)
  );
}

export function createBooking(dto: CreateBookingDto): BookingResponse {
  const room = getRoomById(dto.roomId);
  if (!room) {
    throw new NotFoundError('Room', dto.roomId);
  }

  const startTime = parseIsoDate(dto.startTime);
  const endTime = parseIsoDate(dto.endTime);

  if (hasOverlappingBooking(dto.roomId, startTime, endTime)) {
    throw new ConflictError('Room already booked for this time period');
  }

  const booking: Booking = {
    id: uuidv4(),
    roomId: dto.roomId,
    userId: dto.userId,
    userEmail: dto.userEmail,
    title: dto.title,
    startTime,
    endTime,
    createdAt: new Date(),
  };

  bookingDb.create(booking);

  return toBookingResponse(booking, room.name);
}

export function deleteBooking(bookingId: string): void {
  const deleted = bookingDb.delete(bookingId);
  if (!deleted) {
    throw new NotFoundError('Booking', bookingId);
  }
}

export function getBookingsByRoomId(roomId: string): BookingResponse[] {
  const room = getRoomById(roomId);
  if (!room) {
    throw new NotFoundError('Room', roomId);
  }

  const bookings = bookingDb.getByRoomId(roomId);
  return bookings.map(booking => toBookingResponse(booking, room.name));
}
