import { Router } from "express";
import equipmentRoutes from '@/routes/equipment.routes';
import bodyPartCategoryRoutes from '@/routes/bodyPartCategory.routes';
import muscleGroupRoutes from '@/routes/muscleGroup.routes';

const router = Router();

// Equipment routes
router.use('/equipments', equipmentRoutes);
// Body prt categories routes
router.use('/body-part-categories', bodyPartCategoryRoutes)
// Muscle groups routes
router.use('/muscle-groups', muscleGroupRoutes);

export default router;