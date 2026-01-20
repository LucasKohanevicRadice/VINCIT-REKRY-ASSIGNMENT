/**
 * Päivämääräapufunktiot varausten käsittelyyn
 */

/**
 * Tarkistaa onko merkkijono validi ISO 8601 -muotoinen päivämäärä
 * @param dateString - Tarkistettava merkkijono
 * @returns true jos validi ISO-päivämäärä, muuten false
 */
export function isValidIsoDateString(dateString: string): boolean {
  if (typeof dateString !== 'string' || dateString === '') {
    return false;
  }

  const date = new Date(dateString);

  // Tarkistetaan että Date-objekti on validi
  if (isNaN(date.getTime())) {
    return false;
  }

  // Tarkistetaan että alkuperäinen merkkijono sisältää T-erottimen
  // joka on ISO 8601 -formaatin tunnusmerkki
  return dateString.includes('T');
}

/**
 * Parsii ISO 8601 -merkkijonon Date-objektiksi
 * @param dateString - ISO-muotoinen päivämäärämerkkijono
 * @returns Date-objekti
 * @throws Error jos merkkijono ei ole validi
 */
export function parseIsoDate(dateString: string): Date {
  if (!isValidIsoDateString(dateString)) {
    throw new Error(`Invalid ISO date string: ${dateString}`);
  }

  return new Date(dateString);
}

/**
 * Tarkistaa onko päivämäärä menneisyydessä
 * @param date - Tarkistettava päivämäärä
 * @returns true jos päivämäärä on menneisyydessä
 */
export function isInPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Tarkistaa menevätkö kaksi aikaväliä päällekkäin
 *
 * Päällekkäisyys havaitaan kun: newStart < existingEnd && newEnd > existingStart
 *
 * Visualisointi:
 * Olemassaoleva:  |-------|
 * Uusi 1:      |---|          (loppuu kun vanha alkaa - OK: newEnd <= existingStart)
 * Uusi 2:             |---|   (alkaa kun vanha loppuu - OK: newStart >= existingEnd)
 * Uusi 3-6:    päällekkäin    (KONFLIKTI)
 *
 * @param newStart - Uuden varauksen alkuaika
 * @param newEnd - Uuden varauksen loppuaika
 * @param existingStart - Olemassaolevan varauksen alkuaika
 * @param existingEnd - Olemassaolevan varauksen loppuaika
 * @returns true jos aikavälit menevät päällekkäin
 */
export function doTimeRangesOverlap(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date,
): boolean {
  // Päällekkäisyys: uusi alkaa ennen vanhan loppua JA uusi loppuu vanhan alun jälkeen
  return (
    newStart.getTime() < existingEnd.getTime() &&
    newEnd.getTime() > existingStart.getTime()
  );
}

/**
 * Muuntaa Date-objektin ISO 8601 -merkkijonoksi
 * @param date - Muunnettava päivämäärä
 * @returns ISO-muotoinen merkkijono
 */
export function toIsoString(date: Date): string {
  return date.toISOString();
}
