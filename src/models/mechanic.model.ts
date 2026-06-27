import { DataTypes, Model } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import { ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import { addShareCodeToModel } from "@/services/shareCode.service";
import { Exercise } from "./exercise.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class Mechanic extends Model<FilterAttributes, FilterCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'FORC';

  async transform(): Promise<FilterModelResponse> {
    const response: FilterModelResponse = {
      id: this.shareCode,
      name: this.name,
    };
    return response;
  }

  public static initializeModel() {
    Mechanic.init(
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
        shareCode: {
          type: DataTypes.STRING,
          allowNull: true, // Keep it false in migration as it is generated in beforeCreate hook
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
        tableName: 'Mechanics',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (equipment: Mechanic) => {
            addShareCodeToModel(equipment, Mechanic.prefix);
          },
          beforeBulkCreate: (equipments: Mechanic[]) => {
            // Support bulk operations safely for seeders
            for (const equipment of equipments) {
              addShareCodeToModel(equipment, Mechanic.prefix);
            }
          }
        },
      }
    );
  }

  public static associate() {
    Mechanic.hasMany(Exercise, { foreignKey: 'mechanicId', onDelete: 'CASCADE' });
  }
}

Mechanic.initializeModel();

export default Mechanic;