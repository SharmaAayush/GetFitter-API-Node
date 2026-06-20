import { Model } from "sequelize";

export interface ModelWithAssociations {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): Model; // Constructor requirement
  associate(): void;
}