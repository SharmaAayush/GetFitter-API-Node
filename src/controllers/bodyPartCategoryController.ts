import { Request, Response } from 'express';
import BodyPartCategory from '@/models/bodypartcategory.model';
import logger from '@/services/logger';

export class BodyPartCategoryController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const bodyPartCategories = await BodyPartCategory.findAll({
        attributes: ['id', 'name', 'description'], // Select specific attributes
        order: [['name', 'ASC']], // Order by name in ascending order
      });
      res.json({
        success: true,
        data: bodyPartCategories,
        message: 'Body part categories fetched successfully',
      });
    } catch (error) {
      logger.error('BodyPartCategoryController.getAll: Error fetching body part categories');
      logger.debug(error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch body part categories'
        },
        data: null,
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        logger.warn('BodyPartCategoryController.getById: No body part category ID provided');
        res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Body part category ID is required',
          },
          data: null,
        });
        return;
      }

      const bodyPartCategory = await BodyPartCategory.findByPk(
        id as string,
        { attributes: ['id', 'name', 'description'] }
      );

      if (!bodyPartCategory) {
        logger.warn(`BodyPartCategoryController.getById: Body part category with ID ${id} not found`);
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Body part category with ID ${id} not found`,
          },
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: bodyPartCategory,
        message: `Successfully retrieved body part category with ID ${id}`
      });
    } catch (error) {
      logger.error('BodyPartCategoryController.getById: Error fetching body part category');
      logger.debug(error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch body part category'
        },
        data: null,
      });
    }
  }
}