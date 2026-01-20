import { Router } from 'express';
import bookingRoutes from './booking.routes';

const router = Router();

router.use('/api', bookingRoutes);

export default router;
