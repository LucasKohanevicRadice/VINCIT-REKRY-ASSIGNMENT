/**
 * Custom error -luokat API:n virheenkäsittelyyn
 */

/**
 * Perusvirheluokka, josta muut virheet periytyvät
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';

    // Varmistetaan että prototype chain toimii oikein
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validointivirhe (400 Bad Request)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Resurssia ei löydy (404 Not Found)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(
      404,
      `${resource.toUpperCase()}_NOT_FOUND`,
      `${resource} with ID '${id}' not found`,
    );
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Konfliktivirhe, esim. päällekkäinen varaus (409 Conflict)
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(409, 'BOOKING_CONFLICT', message, details);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
