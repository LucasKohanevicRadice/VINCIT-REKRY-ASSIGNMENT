/**
 * Varauksen validointi
 */

import { CreateBookingDto } from '../models/booking.model';
import {
  isValidIsoDateString,
  parseIsoDate,
  isInPast,
} from '../utils/dateUtils';

/**
 * Yksittäinen validointivirhe
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validoinnin tulos
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Tarkistaa onko merkkijono validi sähköpostiosoite
 * Yksinkertainen regex-tarkistus perusmuodolle
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validoi varauksen luontipyynnön
 *
 * Tarkistaa:
 * 1. Pakolliset kentät: roomId, userId, userEmail, title, startTime, endTime
 * 2. Tyhjät merkkijonot: roomId, title
 * 3. Sähköpostin formaatti: userEmail
 * 4. ISO 8601 -formaatti: startTime, endTime
 * 5. Business-säännöt:
 *    - startTime ei menneisyydessä
 *    - endTime ei menneisyydessä
 *    - startTime < endTime
 *
 * @param dto - Varauksen luontipyyntö
 * @returns ValidationResult - isValid ja mahdolliset virheet
 */
export function validateCreateBooking(
  dto: Partial<CreateBookingDto>,
): ValidationResult {
  const errors: ValidationError[] = [];

  // 1. Pakolliset kentät
  if (dto.roomId === undefined || dto.roomId === null) {
    errors.push({ field: 'roomId', message: 'roomId on pakollinen' });
  } else if (dto.roomId.trim() === '') {
    errors.push({ field: 'roomId', message: 'roomId ei voi olla tyhjä' });
  }

  if (dto.userId === undefined || dto.userId === null) {
    errors.push({ field: 'userId', message: 'userId on pakollinen' });
  } else if (dto.userId.trim() === '') {
    errors.push({ field: 'userId', message: 'userId ei voi olla tyhjä' });
  }

  if (dto.userEmail === undefined || dto.userEmail === null) {
    errors.push({ field: 'userEmail', message: 'userEmail on pakollinen' });
  } else if (!isValidEmail(dto.userEmail)) {
    errors.push({
      field: 'userEmail',
      message: 'userEmail ei ole validi sähköpostiosoite',
    });
  }

  if (dto.title === undefined || dto.title === null) {
    errors.push({ field: 'title', message: 'title on pakollinen' });
  } else if (dto.title.trim() === '') {
    errors.push({ field: 'title', message: 'title ei voi olla tyhjä' });
  }

  // 2. Aikakenttien validointi
  let startTimeValid = false;
  let endTimeValid = false;
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (dto.startTime === undefined || dto.startTime === null) {
    errors.push({ field: 'startTime', message: 'startTime on pakollinen' });
  } else if (!isValidIsoDateString(dto.startTime)) {
    errors.push({
      field: 'startTime',
      message: 'startTime ei ole validi ISO 8601 -päivämäärä',
    });
  } else {
    startDate = parseIsoDate(dto.startTime);
    startTimeValid = true;

    // Business-sääntö: ei menneisyyteen
    if (isInPast(startDate)) {
      errors.push({
        field: 'startTime',
        message: 'startTime ei voi olla menneisyydessä',
      });
    }
  }

  if (dto.endTime === undefined || dto.endTime === null) {
    errors.push({ field: 'endTime', message: 'endTime on pakollinen' });
  } else if (!isValidIsoDateString(dto.endTime)) {
    errors.push({
      field: 'endTime',
      message: 'endTime ei ole validi ISO 8601 -päivämäärä',
    });
  } else {
    endDate = parseIsoDate(dto.endTime);
    endTimeValid = true;

    // Business-sääntö: ei menneisyyteen
    if (isInPast(endDate)) {
      errors.push({
        field: 'endTime',
        message: 'endTime ei voi olla menneisyydessä',
      });
    }
  }

  // 3. Business-sääntö: startTime < endTime
  if (startTimeValid && endTimeValid && startDate && endDate) {
    if (endDate.getTime() <= startDate.getTime()) {
      errors.push({
        field: 'endTime',
        message: 'endTime täytyy olla startTimen jälkeen',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
