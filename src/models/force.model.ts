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
export class Force extends Model<FilterAttributes, FilterCreationAttributes> {
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
    Force.init(
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
        tableName: 'Forces',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (equipment: Force) => {
            addShareCodeToModel(equipment, Force.prefix);
          },
          beforeBulkCreate: (equipments: Force[]) => {
            // Support bulk operations safely for seeders
            for (const equipment of equipments) {
              addShareCodeToModel(equipment, Force.prefix);
            }
          }
        },
      }
    );
  }

  public static associate() {
    Force.hasMany(Exercise, { foreignKey: 'forceId', onDelete: 'CASCADE' })
  }
}

Force.initializeModel();

export default Force;