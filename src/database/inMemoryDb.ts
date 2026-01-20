/**
 * In-memory tietokanta kokoushuoneille ja varauksille
 *
 * Tämä moduuli toimii yksinkertaisena muistinvaraisena tietokantana,
 * joka säilyttää datan vain sovelluksen ajon ajan.
 */

import { Room } from '../models/room.model';
import { Booking } from '../models/booking.model';

/**
 * Esiladatut kokoushuoneet
 * Nämä huoneet ovat käytettävissä heti sovelluksen käynnistyessä
 */
const rooms: Map<string, Room> = new Map([
  ['room-1', { id: 'room-1', name: 'Neuvotteluhuone A' }],
  ['room-2', { id: 'room-2', name: 'Neuvotteluhuone B' }],
  ['room-3', { id: 'room-3', name: 'Kokoushuone C' }],
  ['room-4', { id: 'room-4', name: 'Auditorio' }],
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
  /**
   * Hakee kaikki huoneet
   * @returns Lista kaikista huoneista
   */
  getAll(): Room[] {
    return Array.from(rooms.values());
  },

  /**
   * Hakee huoneen ID:n perusteella
   * @param id - Huoneen ID
   * @returns Huone tai null jos ei löydy
   */
  getById(id: string): Room | null {
    return rooms.get(id) || null;
  },

  /**
   * Tarkistaa onko huone olemassa
   * @param id - Huoneen ID
   * @returns true jos huone löytyy
   */
  exists(id: string): boolean {
    return rooms.has(id);
  },
};

/**
 * Varausten tietokantaoperaatiot
 */
export const bookingDb = {
  /**
   * Hakee kaikki varaukset
   * @returns Lista kaikista varauksista
   */
  getAll(): Booking[] {
    return Array.from(bookings.values());
  },

  /**
   * Hakee varauksen ID:n perusteella
   * @param id - Varauksen ID
   * @returns Varaus tai null jos ei löydy
   */
  getById(id: string): Booking | null {
    return bookings.get(id) || null;
  },

  /**
   * Hakee kaikki tietyn huoneen varaukset
   * @param roomId - Huoneen ID
   * @returns Lista huoneen varauksista
   */
  getByRoomId(roomId: string): Booking[] {
    return Array.from(bookings.values()).filter(
      (booking) => booking.roomId === roomId
    );
  },

  /**
   * Lisää uuden varauksen
   * @param booking - Tallennettava varaus
   * @returns Tallennettu varaus
   */
  create(booking: Booking): Booking {
    bookings.set(booking.id, booking);
    return booking;
  },

  /**
   * Poistaa varauksen
   * @param id - Poistettavan varauksen ID
   * @returns true jos varaus poistettiin, false jos ei löytynyt
   */
  delete(id: string): boolean {
    return bookings.delete(id);
  },

  /**
   * Tarkistaa onko varaus olemassa
   * @param id - Varauksen ID
   * @returns true jos varaus löytyy
   */
  exists(id: string): boolean {
    return bookings.has(id);
  },

  /**
   * Tyhjentää kaikki varaukset (käytetään testeissä)
   */
  clear(): void {
    bookings.clear();
  },
};
