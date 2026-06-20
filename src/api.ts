import { Router } from "express";
import equipmentRoutes from '@/routes/equipmentRoutes';
import bodyPartCategoryRoutes from '@/routes/bodyPartCategoryRoutes';
import muscleGroupRoutes from '@/routes/muscleGroupRoutes';

const router = Router();

// Equipment routes
router.use('/equipments', equipmentRoutes);
// Body prt categories routes
router.use('/body-part-categories', bodyPartCategoryRoutes)
// Muscle groups routes
router.use('/muscle-groups', muscleGroupRoutes);

export default router;