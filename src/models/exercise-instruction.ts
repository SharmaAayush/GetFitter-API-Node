import { DataTypes, Model, Optional } from "sequelize";

import sequelize from '@/config/database'
import {
  BaseModelAttributes,
  BaseModelCreationExcludedAttributes,
  CreatedAtAttribute,
  DeletedAtAttribute,
  GenerateModelShareCodeHooks,
  IdAttribute,
  ModelWithAssociations,
  ModelWithInitialization,
  ModelWithShareCode,
  ShareCodeAttribute,
  UpdatedAtAttribute,
} from "@/types/base.models";
import Exercise from "./exercise.model";

export interface ExerciseInstructionAttributes extends BaseModelAttributes {
  instruction: string;
  order: number;
  exerciseId: string;
}

export type ExerciseInstructionCreationAttributes = Optional<ExerciseInstructionAttributes, BaseModelCreationExcludedAttributes>

@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class ExerciseInstruction extends Model<ExerciseInstructionAttributes, ExerciseInstructionCreationAttributes> {
  declare id: string;
  declare instruction: string;
  declare order: number;
  declare exerciseId: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'STEP';

  public static initializeModel() {
    ExerciseInstruction.init(
      {
        id: IdAttribute,
        instruction: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        exerciseId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        shareCode: ShareCodeAttribute,
        createdAt: CreatedAtAttribute,
        updatedAt: UpdatedAtAttribute,
        deletedAt: DeletedAtAttribute,
      },
      {
        sequelize,
        tableName: 'ExerciseInstructions',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(ExerciseInstruction),
      }
    );
  }

  public static associate() {
    ExerciseInstruction.belongsTo(Exercise, { foreignKey: 'exerciseId', onDelete: 'CASCADE' });
  }
}

ExerciseInstruction.initializeModel();

export default ExerciseInstruction;