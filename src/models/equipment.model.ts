import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import { EquipmentResponse } from "@/types/equipment";
import { ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";

// Define the attributes for the Equipment model
interface EquipmentAttributes {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
type EquipmentCreationAttributes = Optional<EquipmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

@ModelWithTransformation()
@ModelWithInitialization()
export class Equipment extends Model<EquipmentAttributes, EquipmentCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  transform(): EquipmentResponse {
    const response: EquipmentResponse = {
      id: this.id,
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
      }
    );
  }
}

export default Equipment;
