import { Request, Response } from 'express';
import MuscleGroup from '@/models/musclegroup.model';
import BodyPartCategory from '@/models/bodypartcategory.model';
import logger from '@/services/logger';

export class MuscleGroupController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const muscleGroups = await MuscleGroup.findAll({
        attributes: ['id', 'name', 'description'], // Select specific attributes
        order: [['name', 'ASC']], // Order by name in ascending order
        include: {
          // Include body part category information
          model: BodyPartCategory,
          attributes: ['id', 'name'],
        },
      });
      res.json({
        success: true,
        data: muscleGroups,
        message: 'Muscle groups fetched successfully',
      });
    } catch (error) {
      logger.error('MuscleGrouptController.getAll: Error fetching muscle groups');
      logger.debug(error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch muscle groups',
        },
        data: null,
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        logger.warn('MuscleGrouptController.getById: No muscle group ID provided');
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Muscle group ID is required',
          },
          data: null,
        });
        return;
      }

      const muscleGroup = await MuscleGroup.findByPk(
        id as string,
        {
          attributes: ['id', 'name', 'description'],
          include: {
            // Include body part category information
            model: BodyPartCategory,
            attributes: ['id', 'name'],
          },
        }
      );

      if (!muscleGroup) {
        logger.warn(`MuscleGrouptController.getById: Muscle group with ID ${id} not found`);
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Muscle group with ID ${id} not found`,
          },
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: muscleGroup,
        message: `Successfully retrieved muscle group with ID ${id}`
      });
    } catch (error) {
      logger.error('MuscleGrouptController.getById: Error fetching muscle group');
      logger.debug(error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch muscle group',
        },
        data: null,
      });
    }
  }
}