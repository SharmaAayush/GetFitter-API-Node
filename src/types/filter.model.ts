import { Optional } from "sequelize";

// Define the attributes for the Equipment model
export interface FilterAttributes {
  id: string;
  name: string;
  shareCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
export type FilterCreationAttributes = Optional<FilterAttributes, 'id' | 'shareCode' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface FilterModelResponse {
  id: string;
  name: string;
}
