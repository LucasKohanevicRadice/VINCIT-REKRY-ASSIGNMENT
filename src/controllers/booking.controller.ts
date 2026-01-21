import { Request, Response, NextFunction } from 'express';
import {
  createBooking,
  deleteBooking,
  getBookingsByRoomId,
} from '../services/booking.service';
import { validateCreateBooking } from '../validators/booking.validator';
import { ValidationError } from '../errors/customErrors';

export function createBookingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const validation = validateCreateBooking(req.body);

    if (!validation.isValid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    const booking = createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export function deleteBookingHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // Express route parameters are guaranteed to be strings
    const id = req.params.id as string;
    deleteBooking(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function getBookingsByRoomHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // Express route parameters are guaranteed to be strings
    const roomId = req.params.roomId as string;
    const bookings = getBookingsByRoomId(roomId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
}
