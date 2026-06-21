import { Router } from "express";
import equipmentRoutes from '@/routes/equipment.routes';
import muscleGroupRoutes from '@/routes/muscleGroup.routes';

const router = Router();

// Equipment routes
router.use('/equipments', equipmentRoutes);
// Muscle groups routes
router.use('/muscle-groups', muscleGroupRoutes);

export default router;