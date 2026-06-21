import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import { EquipmentResponse } from "@/types/DTOs/equipment";
import { ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";
import { addShareCodeToModel } from "@/services/shareCode.service";

// Define the attributes for the Equipment model
interface EquipmentAttributes {
  id: string;
  name: string;
  description?: string;
  shareCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
type EquipmentCreationAttributes = Optional<EquipmentAttributes, 'id' | 'shareCode' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

@ModelWithTransformation<EquipmentResponse>()
@ModelWithInitialization()
export class Equipment extends Model<EquipmentAttributes, EquipmentCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'EQPM';

  async transform(): Promise<EquipmentResponse> {
    const response: EquipmentResponse = {
      id: this.shareCode,
      name: this.name,
    };
    if (this.description) response.description = this.description;
    return response;
  }

  public static initializeModel() {

    Equipment.init(
      {
        id: {
          type: DataTypes.UUID,
          // Sequelize invokes this function for every new record
          defaultValue: () => uuidv7(),
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        shareCode: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        }
      },
      {
        sequelize,
        tableName: 'Equipments',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (equipment: Equipment) => {
            addShareCodeToModel(equipment, Equipment.prefix);
          },
          beforeBulkCreate: (equipments: Equipment[]) => {
            // Support bulk operations safely for seeders
            for (const equipment of equipments) {
              addShareCodeToModel(equipment, Equipment.prefix);
            }
          }
        },
      }
    );
  }
}

Equipment.initializeModel();

export default Equipment;
