import { DataTypes, Model } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import { ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import { addShareCodeToModel } from "@/services/shareCode.service";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
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
}

Mechanic.initializeModel();

export default Mechanic;