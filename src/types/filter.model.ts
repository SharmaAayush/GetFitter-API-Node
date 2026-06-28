import { Optional } from "sequelize";
import { BaseModelAttributes, BaseModelCreationExcludedAttributes, BaseModelResponse } from "@/types/base.models";

// Define the attributes for the Filter model
export interface FilterAttributes extends BaseModelAttributes {
  name: string;
}

// Define which attributes are optional when creating an Filter instance
export type FilterCreationAttributes = Optional<FilterAttributes, BaseModelCreationExcludedAttributes>;

export type FilterModelResponse = BaseModelResponse;
