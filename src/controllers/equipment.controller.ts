import { Request, Response } from 'express';
import Equipment from '@/models/equipment.model';
import logger from '@/services/logger';

export class EquipmentController {
  static async getAllEquipment(_req: Request, res: Response): Promise<void> {
    try {
      const equipments = await Equipment.findAll({
        attributes: ['id', 'name', 'description'], // Select specific attributes
        order: [['name', 'ASC']], // Order by name in ascending order
      });
      res.json({
        success: true,
        data: equipments,
        message: 'Equipment list fetched successfully',
      });
    } catch (error) {
      logger.error('EquipmentController.getAllEquipment: Error fetching equipment');
      logger.debug(error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch equipments'
        },
        data: null,
      });
    }
  }

  static async getEquipmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        logger.warn('EquipmentController.getEquipmentById: No equipment ID provided');
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Equipment ID is required',
          },
          data: null,
        });
        return;
      }

      const equipment = await Equipment.findByPk(
        id as string,
        { attributes: ['id', 'name', 'description'] }
      );

      if (!equipment) {
        logger.warn(`EquipmentController.getEquipmentById: Equipment with ID ${id} not found`);
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Equipment with ID ${id} not found`,
          },
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: equipment,
        message: `Successfully retrieved equipment with ID ${id}`
      });
    } catch (error) {
      logger.error('EquipmentController.getEquipmentById: Error fetching equipment');
      logger.debug(error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch equipment'
        },
        data: null,
      });
    }
  }
}