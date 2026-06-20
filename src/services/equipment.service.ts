import Equipment from "@/models/equipment.model";
import { errAsync, okAsync } from "neverthrow";
import logger from "@/services/logger";

export class EquipmentService {
  static async getAll() {
    try {
      const equipments = await Equipment.findAll({
        order: [['name', 'ASC']], // Order by name in ascending order
      });

      return okAsync(equipments);
    } catch (error) {
      logger.error('EquipmentController.getAllEquipment: Error fetching equipment');
      logger.debug(error);
      return errAsync({
        reason: 'INTERNAL_SERVER_ERROR',
        details: error,
      } as const);
    }
  }

  static async getById(id?: string) {
    try {
      if (!id) {
        logger.warn('EquipmentController.getEquipmentById: No equipment ID provided');
        return errAsync({
          reason: 'BAD_REQUEST',
          details: 'Equipment ID is required',
        } as const);
      }

      const equipment = await Equipment.findByPk(id);

      if (!equipment) {
        logger.warn(`EquipmentController.getEquipmentById: Equipment with ID ${id} not found`);

        return errAsync({
          reason: 'NOT_FOUND',
          details: `Equipment with ID ${id} not found`,
        } as const);
      }

      return okAsync(equipment);
    } catch (error) {
      logger.error('EquipmentController.getEquipmentById: Error fetching equipment');
      logger.debug(error);
      return errAsync({
        reason: 'INTERNAL_SERVER_ERROR',
        details: error,
      } as const);
    }
  }
}