import { addShareCodeToModel } from "@/services/shareCode.service";
import { DataTypes } from "sequelize";
import { uuidv7 } from "uuidv7";

export interface IModelWithAssociations {
  associate(): void;
}

export interface IModelWithInitialization {
  initializeModel(): void;
}

export interface IModelWithShareCode {
  prefix: string;
}

export interface IModelWithTransformation<T> {
  transform(): Promise<T>;
}

export function ModelWithAssociations<T extends IModelWithAssociations>() {
  return (_constructor: T) => { };
}

export function ModelWithInitialization<T extends IModelWithInitialization>() {
  return (_constructor: T) => { };
}

export function ModelWithShareCode<T extends IModelWithShareCode>() {
  return (_constructor: T) => { };
}

export function ModelWithTransformation<T>() {
  // It returns a class validator constrained to an instance matching IMovementInstance<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <U extends new (...args: any[]) => IModelWithTransformation<T>>(constructor: U) => {
    return constructor;
  };
}

export interface BaseModelAttributes {
  id: string;
  shareCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type BaseModelCreationExcludedAttributes = 'id' | 'shareCode' | 'createdAt' | 'updatedAt' | 'deletedAt';

export interface BaseModelResponse {
  id: string;
  name: string;
}

export const IdAttribute = {
  type: DataTypes.UUID,
  // Sequelize invokes this function for every new record
  defaultValue: () => uuidv7(),
  allowNull: false,
  primaryKey: true,
};

export const NameAttribute = {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
};

export const ShareCodeAttribute = {
  type: DataTypes.STRING,
  allowNull: true, // Keep it false in migration as it is generated in beforeCreate hook
  unique: true,
};

export const CreatedAtAttribute = {
  type: DataTypes.DATE,
  allowNull: false,
};

export const UpdatedAtAttribute = {
  type: DataTypes.DATE,
  allowNull: false,
};

export const DeletedAtAttribute = {
  type: DataTypes.DATE,
  allowNull: true,
  defaultValue: null,
};

export const BaseModelInitAttributes = {
  id: IdAttribute,
  name: NameAttribute,
  shareCode: ShareCodeAttribute,
  createdAt: CreatedAtAttribute,
  updatedAt: UpdatedAtAttribute,
  deletedAt: DeletedAtAttribute,
}

export function GenerateModelShareCodeHooks<T extends { id?: string, shareCode: string}>(model: IModelWithShareCode) {
  return {
    beforeCreate: (element: T) => {
      addShareCodeToModel(element, model.prefix);
    },
    beforeBulkCreate: (elements: T[]) => {
      // Support bulk operations safely for seeders
      for (const equipment of elements) {
        addShareCodeToModel(equipment, model.prefix);
      }
    }
  }
}