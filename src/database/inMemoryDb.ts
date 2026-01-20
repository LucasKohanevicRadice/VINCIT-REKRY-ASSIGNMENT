/**
 * In-memory tietokanta kokoushuoneille ja varauksille
 *
 * Tämä moduuli toimii yksinkertaisena muistinvaraisena tietokantana,
 * joka säilyttää datan vain sovelluksen ajon ajan.
 */

import { Room } from "../models/room.model";
import { Booking } from "../models/booking.model";

/**
 * Esiladatut kokoushuoneet
 * Nämä huoneet ovat käytettävissä heti sovelluksen käynnistyessä
 */
const rooms: Map<string, Room> = new Map([
  ["room-1", { id: "room-1", name: "Neuvotteluhuone A" }],
  ["room-2", { id: "room-2", name: "Neuvotteluhuone B" }],
  ["room-3", { id: "room-3", name: "Kokoushuone C" }],
  ["room-4", { id: "room-4", name: "Auditorio" }],
]);

/**
 * Varaukset tallennetaan Map-rakenteeseen
 * Avaimena varauksen ID, arvona Booking-objekti
 */
const bookings: Map<string, Booking> = new Map();

/**
 * Huoneiden tietokantaoperaatiot
 */
export const roomDb = {
  getAllRooms(): Room[] {
    return Array.from(rooms.values());
  },

  getRoomById(id: string): Room | null {
    return rooms.get(id) || null;
  },

  roomExists(id: string): boolean {
    return rooms.has(id);
  },
};

/**
 * Varausten tietokantaoperaatiot
 */
export const bookingDb = {
  getAllBookings(): Booking[] {
    return Array.from(bookings.values());
  },

  getBookingById(id: string): Booking | null {
    return bookings.get(id) || null;
  },

  getBookingsByRoomId(roomId: string): Booking[] {
    return Array.from(bookings.values()).filter(
      (booking) => booking.roomId === roomId,
    );
  },

  createBooking(booking: Booking): Booking {
    bookings.set(booking.id, booking);
    return booking;
  },

  deleteBooking(id: string): boolean {
    return bookings.delete(id);
  },

  bookingExists(id: string): boolean {
    return bookings.has(id);
  },

  clearBookings(): void {
    bookings.clear();
  },
};
