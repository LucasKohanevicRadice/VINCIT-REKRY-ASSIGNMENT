/**
 * Swagger/OpenAPI konfiguraatio
 *
 * Määrittelee API-dokumentaation asetukset ja skeeman
 */

import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kokoushuonevaraus API',
      version: '1.0.0',
      description: 'REST API kokoushuoneiden varaamiseen',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Kehityspalvelin',
      },
    ],
    components: {
      schemas: {
        Room: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'room-1' },
            name: { type: 'string', example: 'Neuvotteluhuone A' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-1234' },
            roomId: { type: 'string', example: 'room-1' },
            roomName: { type: 'string', example: 'Neuvotteluhuone A' },
            userId: { type: 'string', example: 'user-123' },
            userEmail: { type: 'string', example: 'user@example.com' },
            title: { type: 'string', example: 'Tiimipalaveri' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateBookingRequest: {
          type: 'object',
          required: [
            'roomId',
            'userId',
            'userEmail',
            'title',
            'startTime',
            'endTime',
          ],
          properties: {
            roomId: { type: 'string', example: 'room-1' },
            userId: { type: 'string', example: 'user-123' },
            userEmail: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            title: { type: 'string', example: 'Tiimipalaveri' },
            startTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:00:00Z',
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T11:00:00Z',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Virheellinen syöte' },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../routes/*.js'),
  ],
};
export const swaggerSpec = swaggerJsdoc(options);
