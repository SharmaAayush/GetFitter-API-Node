import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database'
import { UserModelResponse } from "@/types/user.dto";
import {
  ModelWithInitialization,
  ModelWithShareCode,
  ModelWithTransformation
} from "@/types/base.models";
import { addShareCodeToModel } from "@/services/shareCode.service";

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  shareCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id'
  | 'shareCode'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

@ModelWithTransformation<UserModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;
  declare email: string;
  declare password: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static prefix = 'USR';

  async transform(): Promise<UserModelResponse> {
    const response: UserModelResponse = {
      email: this.email,
      id: this.shareCode,
    }
    return response;
  }

  public static initializeModel() {
    User.init({
      id: {
        type: DataTypes.UUID,
        // Sequelize invokes this function for every new record
        defaultValue: () => uuidv7(),
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // make it nullable later for SSO logins
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
    }, {
      sequelize,
      tableName: 'Users',
      paranoid: true, // Enable paranoid mode for soft deletes
      hooks: {
        beforeCreate: (item: User) => {
          addShareCodeToModel(item, User.prefix);
        },
        beforeBulkCreate: (item: User[]) => {
          // Support bulk operations safely for seeders
          for (const equipment of item) {
            addShareCodeToModel(equipment, User.prefix);
          }
        }
      },
    })
  }
}

User.initializeModel();

export default User;