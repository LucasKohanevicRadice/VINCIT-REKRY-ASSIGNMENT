import {
  isValidIsoDateString,
  parseIsoDate,
  isInPast,
  doTimeRangesOverlap,
  toIsoString,
} from '../../../src/utils/dateUtils';

describe('dateUtils', () => {
  /**
   * isValidIsoDateString - Testaa ISO 8601 päivämäärämerkkijonon validointia
   * Funktio tarkistaa onko annettu merkkijono validi ISO-muotoinen päivämäärä
   */
  describe('isValidIsoDateString', () => {
    it('should return true for valid ISO 8601 date string', () => {
      expect(isValidIsoDateString('2024-01-15T10:00:00Z')).toBe(true);
      expect(isValidIsoDateString('2024-01-15T10:00:00.000Z')).toBe(true);
      expect(isValidIsoDateString('2024-01-15T10:00:00+02:00')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(isValidIsoDateString('not-a-date')).toBe(false);
      expect(isValidIsoDateString('')).toBe(false);
      expect(isValidIsoDateString('2024-13-45T99:99:99Z')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isValidIsoDateString(null as unknown as string)).toBe(false);
      expect(isValidIsoDateString(undefined as unknown as string)).toBe(false);
      expect(isValidIsoDateString(123 as unknown as string)).toBe(false);
    });
  });

  /**
   * parseIsoDate - Testaa ISO-merkkijonon muuntamista Date-objektiksi
   * Funktio parsii validin ISO-merkkijonon ja palauttaa Date-objektin
   */
  describe('parseIsoDate', () => {
    it('should parse valid ISO string to Date object', () => {
      const result = parseIsoDate('2024-01-15T10:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should throw error for invalid date string', () => {
      expect(() => parseIsoDate('invalid')).toThrow();
    });
  });

  /**
   * isInPast - Testaa onko päivämäärä menneisyydessä
   * Funktio vertaa annettua päivämäärää nykyhetkeen
   */
  describe('isInPast', () => {
    it('should return true for past dates', () => {
      const pastDate = new Date('2020-01-01T00:00:00Z');
      expect(isInPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date(Date.now() + 86400000); // +1 päivä
      expect(isInPast(futureDate)).toBe(false);
    });
  });

  /**
   * doTimeRangesOverlap - Testaa aikavälien päällekkäisyyttä
   * Kriittinen business-logiikka: estää päällekkäiset varaukset samaan huoneeseen
   *
   * Visualisointi:
   * Olemassaoleva:             |-------|
   * Uusi 1:                |---|                    (Uusi varaus loppuu kun vanha alkaa - OK)
   * Uusi 2:                            |---|        (Uusi varaus alkaa kun vanha loppuu - OK)
   * Uusi 3:                  |---|                  (Uusi varaus menee päällekkäin alusta - KONFLIKTI)
   * Uusi 4:                          |---|          (Uusi varaus menee päällekkäin lopusta - KONFLIKTI)
   * Uusi 5:                      |---|              (Uusi varaus vanhan varauksen sisällä - KONFLIKTI)
   * Uusi 6:                  |--------------|       (Uusi varaus alkaa ennenkuin vanha varaus alkaa ja loppuu vanhan varauksen jälkeen - KONFLIKTI)
   * Uusi 7:                    |-------|            (Täsmälleen sama aikaväli - KONFLIKTI)
   */
  describe('doTimeRangesOverlap', () => {
    // Olemassaoleva varaus: 10:00 - 11:00
    const existingStart = new Date('2024-01-15T10:00:00Z');
    const existingEnd = new Date('2024-01-15T11:00:00Z');

    /**
     * Testi: Peräkkäiset varaukset - uusi loppuu kun vanha alkaa
     * Tavoite: Varmistaa että varaukset jotka "koskettavat" reunoiltaan
     * EIVÄT ole päällekkäisiä (tärkeä reunatapaus)
     * Esim: 09:00-10:00 ja 10:00-11:00 ovat OK
     */
    it('should return false when new booking ends exactly when existing starts (OK)', () => {
      const newStart = new Date('2024-01-15T09:00:00Z');
      const newEnd = new Date('2024-01-15T10:00:00Z');
      expect(
        doTimeRangesOverlap(newStart, newEnd, existingStart, existingEnd),
      ).toBe(false);
    });

    /**
     * Testi: Peräkkäiset varaukset - uusi alkaa kun vanha loppuu
     * Tavoite: Sama kuin edellä, mutta toiseen suuntaan
     * Esim: 10:00-11:00 ja 11:00-12:00 ovat OK
     */
    it('should return false when new booking starts exactly when existing ends (OK)', () => {
      const newStart = new Date('2024-01-15T11:00:00Z');
      const newEnd = new Date('2024-01-15T12:00:00Z');
      expect(
        doTimeRangesOverlap(newStart, newEnd, existingStart, existingEnd),
      ).toBe(false);
    });

    /**
     * Testi: Päällekkäisyys alkupäässä
     * Tavoite: Tunnistaa kun uusi varaus alkaa ennen vanhaa mutta
     * loppuu vanhan aikana (osittainen päällekkäisyys)
     */
    it('should return true when new booking overlaps start (CONFLICT)', () => {
      const newStart = new Date('2024-01-15T09:30:00Z');
      const newEnd = new Date('2024-01-15T10:30:00Z');
      expect(
        doTimeRangesOverlap(newStart, newEnd, existingStart, existingEnd),
      ).toBe(true);
    });

    /**
     * Testi: Päällekkäisyys loppupäässä
     * Tavoite: Tunnistaa kun uusi varaus alkaa vanhan aikana mutta
     * loppuu vanhan jälkeen (osittainen päällekkäisyys)
     */
    it('should return true when new booking overlaps end (CONFLICT)', () => {
      const newStart = new Date('2024-01-15T10:30:00Z');
      const newEnd = new Date('2024-01-15T11:30:00Z');
      expect(
        doTimeRangesOverlap(newStart, newEnd, existingStart, existingEnd),
      ).toBe(true);
    });

    /**
     * Testi: Uusi varaus kokonaan vanhan sisällä
     * Tavoite: Tunnistaa kun uusi varaus on lyhyempi ja
     * sijoittuu kokonaan olemassaolevan varauksen sisälle
     */
    it('should return true when new booking is inside existing (CONFLICT)', () => {
      const newStart = new Date('2024-01-15T10:15:00Z');
      const newEnd = new Date('2024-01-15T10:45:00Z');
      expect(
        doTimeRangesOverlap(newStart, newEnd, existingStart, existingEnd),
      ).toBe(true);
    });

    /**
     * Testi: Uusi varaus sisältää vanhan kokonaan
     * Tavoite: Tunnistaa kun uusi varaus on pidempi ja
     * peittää olemassaolevan varauksen kokonaan
     */
    it('should return true when new booking contains existing (CONFLICT)', () => {
      const newStart = new Date('2024-01-15T09:00:00Z');
      const newEnd = new Date('2024-01-15T12:00:00Z');
      expect(
        doTimeRangesOverlap(newStart, newEnd, existingStart, existingEnd),
      ).toBe(true);
    });

    /**
     * Testi: Täsmälleen sama aikaväli
     * Tavoite: Tunnistaa kun uusi varaus on identtinen olemassaolevan kanssa
     */
    it('should return true when bookings are exactly the same (CONFLICT)', () => {
      expect(
        doTimeRangesOverlap(
          existingStart,
          existingEnd,
          existingStart,
          existingEnd,
        ),
      ).toBe(true);
    });
  });

  /**
   * toIsoString - Testaa Date-objektin muuntamista ISO-merkkijonoksi
   * Funktio muuntaa Date-objektin standardimuotoiseksi ISO 8601 -merkkijonoksi
   */
  describe('toIsoString', () => {
    it('should convert Date to ISO string', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      expect(toIsoString(date)).toBe('2024-01-15T10:00:00.000Z');
    });
  });
});
