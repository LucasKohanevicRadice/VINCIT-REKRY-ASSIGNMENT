import {
  validateCreateBooking,
  ValidationResult,
} from '../../../src/validators/booking.validator';

describe('booking.validator', () => {
  /**
   * validateCreateBooking - Testaa varauksen luontipyynnön validointia
   * Funktio tarkistaa että kaikki pakolliset kentät ovat oikein muotoiltuja
   * ja business-säännöt täyttyvät (ajat tulevaisuudessa, startTime < endTime)
   */
  describe('validateCreateBooking', () => {
    /**
     * Apufunktio: Luo validi varausobjekti testausta varten
     * Käyttää tulevaisuuden päivämääriä jotta menneisyystarkistus ei estä
     */
    const createValidBooking = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(11, 0, 0, 0);

      return {
        roomId: 'room-1',
        userId: 'user-123',
        userEmail: 'user@example.com',
        title: 'Tiimipalaveri',
        startTime: tomorrow.toISOString(),
        endTime: tomorrowEnd.toISOString(),
      };
    };

    // ============================================
    // ONNISTUNEET TAPAUKSET
    // ============================================

    /**
     * Testi: Validi varaus hyväksytään
     * Tavoite: Varmistaa että oikein muotoiltu varaus läpäisee validoinnin
     */
    it('should return valid for correct booking data', () => {
      const booking = createValidBooking();
      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    // ============================================
    // PUUTTUVAT KENTÄT
    // ============================================

    /**
     * Testi: Puuttuva roomId hylätään
     * Tavoite: Varmistaa että roomId on pakollinen kenttä
     */
    it('should return error when roomId is missing', () => {
      const booking = createValidBooking();
      delete (booking as Record<string, unknown>).roomId;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'roomId' }),
      );
    });

    /**
     * Testi: Puuttuva userId hylätään
     * Tavoite: Varmistaa että userId on pakollinen kenttä
     */
    it('should return error when userId is missing', () => {
      const booking = createValidBooking();
      delete (booking as Record<string, unknown>).userId;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'userId' }),
      );
    });

    /**
     * Testi: Puuttuva userEmail hylätään
     * Tavoite: Varmistaa että userEmail on pakollinen kenttä
     */
    it('should return error when userEmail is missing', () => {
      const booking = createValidBooking();
      delete (booking as Record<string, unknown>).userEmail;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'userEmail' }),
      );
    });

    /**
     * Testi: Puuttuva title hylätään
     * Tavoite: Varmistaa että title on pakollinen kenttä
     */
    it('should return error when title is missing', () => {
      const booking = createValidBooking();
      delete (booking as Record<string, unknown>).title;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'title' }),
      );
    });

    /**
     * Testi: Puuttuva startTime hylätään
     * Tavoite: Varmistaa että startTime on pakollinen kenttä
     */
    it('should return error when startTime is missing', () => {
      const booking = createValidBooking();
      delete (booking as Record<string, unknown>).startTime;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'startTime' }),
      );
    });

    /**
     * Testi: Puuttuva endTime hylätään
     * Tavoite: Varmistaa että endTime on pakollinen kenttä
     */
    it('should return error when endTime is missing', () => {
      const booking = createValidBooking();
      delete (booking as Record<string, unknown>).endTime;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'endTime' }),
      );
    });

    // ============================================
    // VIRHEELLISET FORMAATIT
    // ============================================

    /**
     * Testi: Virheellinen sähköpostiosoite hylätään
     * Tavoite: Varmistaa että userEmail validoidaan email-formaatin mukaan
     */
    it('should return error for invalid email format', () => {
      const booking = createValidBooking();
      booking.userEmail = 'not-an-email';

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'userEmail' }),
      );
    });

    /**
     * Testi: Virheellinen startTime-formaatti hylätään
     * Tavoite: Varmistaa että startTime on validi ISO 8601 -merkkijono
     */
    it('should return error for invalid startTime format', () => {
      const booking = createValidBooking();
      booking.startTime = 'not-a-date';

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'startTime' }),
      );
    });

    /**
     * Testi: Virheellinen endTime-formaatti hylätään
     * Tavoite: Varmistaa että endTime on validi ISO 8601 -merkkijono
     */
    it('should return error for invalid endTime format', () => {
      const booking = createValidBooking();
      booking.endTime = 'not-a-date';

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'endTime' }),
      );
    });

    // ============================================
    // BUSINESS-SÄÄNNÖT: MENNEISYYS
    // ============================================

    /**
     * Testi: startTime menneisyydessä hylätään
     * Tavoite: Business-sääntö - varaus ei voi alkaa menneisyydessä
     */
    it('should return error when startTime is in the past', () => {
      const booking = createValidBooking();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Eilen
      booking.startTime = pastDate.toISOString();

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'startTime' }),
      );
    });

    /**
     * Testi: endTime menneisyydessä hylätään
     * Tavoite: Business-sääntö - varaus ei voi loppua menneisyydessä
     * HUOM: Tämä on tarkennettu vaatimus - molemmat ajat tarkistetaan
     */
    it('should return error when endTime is in the past', () => {
      const booking = createValidBooking();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Eilen
      booking.endTime = pastDate.toISOString();

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'endTime' }),
      );
    });

    // ============================================
    // BUSINESS-SÄÄNNÖT: AIKAVÄLI
    // ============================================

    /**
     * Testi: endTime ennen startTime hylätään
     * Tavoite: Business-sääntö - aloitusajan on oltava ennen lopetusaikaa
     */
    it('should return error when endTime is before startTime', () => {
      const booking = createValidBooking();
      // Vaihdetaan ajat päittäin
      const temp = booking.startTime;
      booking.startTime = booking.endTime;
      booking.endTime = temp;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'endTime' }),
      );
    });

    /**
     * Testi: startTime ja endTime samaan aikaan hylätään
     * Tavoite: Varauksen on oltava vähintään jonkin pituinen
     */
    it('should return error when startTime equals endTime', () => {
      const booking = createValidBooking();
      booking.endTime = booking.startTime;

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'endTime' }),
      );
    });

    // ============================================
    // TYHJÄT MERKKIJONOT
    // ============================================

    /**
     * Testi: Tyhjä roomId hylätään
     * Tavoite: Tyhjä merkkijono ei kelpaa arvoksi
     */
    it('should return error for empty roomId', () => {
      const booking = createValidBooking();
      booking.roomId = '';

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'roomId' }),
      );
    });

    /**
     * Testi: Tyhjä title hylätään
     * Tavoite: Tyhjä merkkijono ei kelpaa arvoksi
     */
    it('should return error for empty title', () => {
      const booking = createValidBooking();
      booking.title = '';

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ field: 'title' }),
      );
    });

    // ============================================
    // USEITA VIRHEITÄ
    // ============================================

    /**
     * Testi: Useita virheitä raportoidaan kerralla
     * Tavoite: Validointi palauttaa kaikki virheet, ei vain ensimmäistä
     */
    it('should return multiple errors when multiple fields are invalid', () => {
      const booking = {
        roomId: '',
        userId: '',
        userEmail: 'invalid',
        title: '',
        startTime: 'invalid',
        endTime: 'invalid',
      };

      const result: ValidationResult = validateCreateBooking(booking);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
