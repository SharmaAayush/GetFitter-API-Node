import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import { ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";
import { addShareCodeToModel } from "@/services/shareCode.service";
import { MuscleGroupResponse } from "@/types/DTOs/muscleGroup";

// Define the attributes for the Equipment model
export interface MuscleGroupAttributes {
  id: string;
  name: string;
  shareCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
export type MuscleGroupCreationAttributes = Optional<MuscleGroupAttributes, 'id' | 'shareCode' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

@ModelWithTransformation<MuscleGroupResponse>()
@ModelWithInitialization()
export class MuscleGroup extends Model<MuscleGroupAttributes, MuscleGroupCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static prefix = 'MSCL';

  async transform(): Promise<MuscleGroupResponse> {
    const response: MuscleGroupResponse = {
      id: this.shareCode,
      name: this.name,
    }
    return response;
  }

  public static initializeModel() {
    MuscleGroup.init(
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
        tableName: 'MuscleGroups',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (muscleGroup: MuscleGroup) => {
            addShareCodeToModel(muscleGroup, MuscleGroup.prefix);
          },
          beforeBulkCreate: (muscleGroups: MuscleGroup[]) => {
            // Support bulk operations safely for seeders
            for (const muscleGroup of muscleGroups) {
              addShareCodeToModel(muscleGroup, MuscleGroup.prefix);
            }
          }
        },
      }
    );
  }
}

MuscleGroup.initializeModel();

export default MuscleGroup;