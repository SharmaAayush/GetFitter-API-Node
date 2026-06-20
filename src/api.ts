import { Router } from "express";
import equipmentRoutes from '@/routes/equipmentRoutes';
import bodyPartCategoryRoutes from '@/routes/bodyPartCategoryRoutes';

const router = Router();

// Equipment routes
router.use('/equipments', equipmentRoutes);
// Body prt categories routes
router.use('/body-part-categories', bodyPartCategoryRoutes)

export default router;