import { Router } from "express";
import equipmentRoutes from '@/routes/equipment.routes';
import forceRoutes from '@/routes/force.routes';
import levelRoutes from '@/routes/level.routes';
import mechanicRoutes from '@/routes/mechanic.routes';
import muscleGroupRoutes from '@/routes/muscleGroup.routes';

const router = Router();

// Equipment routes
router.use('/equipments', equipmentRoutes);
// Force routes
router.use('/forces', forceRoutes);
// Level routes
router.use('/levels', levelRoutes);
// Mechanic routes
router.use('/mechanics', mechanicRoutes);
// Muscle groups routes
router.use('/muscle-groups', muscleGroupRoutes);

export default router;