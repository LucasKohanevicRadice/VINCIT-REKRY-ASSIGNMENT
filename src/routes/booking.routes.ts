import { Router } from "express";
import {
  createBookingHandler,
  deleteBookingHandler,
  getBookingsByRoomHandler,
} from "../controllers/booking.controller";

const router = Router();

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     summary: Luo uusi varaus
 *     description: Luo uuden kokoushuonevarauksen annetulle aikavälille
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Varaus luotu onnistuneesti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validointivirhe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Huonetta ei löydy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Päällekkäinen varaus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/bookings", createBookingHandler);

/**
 * @openapi
 * /api/bookings/{id}:
 *   delete:
 *     summary: Poista varaus
 *     description: Poistaa olemassa olevan varauksen ID:n perusteella
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Varauksen tunniste
 *     responses:
 *       204:
 *         description: Varaus poistettu onnistuneesti
 *       404:
 *         description: Varausta ei löydy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/bookings/:id", deleteBookingHandler);

/**
 * @openapi
 * /api/rooms/{roomId}/bookings:
 *   get:
 *     summary: Hae huoneen varaukset
 *     description: Palauttaa kaikki tietyn huoneen varaukset
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Huoneen tunniste (esim. room-1)
 *     responses:
 *       200:
 *         description: Lista huoneen varauksista
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Huonetta ei löydy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/rooms/:roomId/bookings", getBookingsByRoomHandler);

export default router;
