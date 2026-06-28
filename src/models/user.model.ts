import { DataTypes, Model, Optional } from "sequelize";

import sequelize from '@/config/database'
import { UserModelResponse } from "@/types/user.dto";
import {
  BaseModelAttributes,
  BaseModelCreationExcludedAttributes,
  CreatedAtAttribute,
  DeletedAtAttribute,
  GenerateModelShareCodeHooks,
  IdAttribute,
  ModelWithInitialization,
  ModelWithShareCode,
  ModelWithTransformation,
  ShareCodeAttribute,
  UpdatedAtAttribute
} from "@/types/base.models";

export interface UserAttributes extends BaseModelAttributes {
  email: string;
  password: string;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  BaseModelCreationExcludedAttributes
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
      id: IdAttribute,
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
      shareCode: ShareCodeAttribute,
      createdAt: CreatedAtAttribute,
      updatedAt: UpdatedAtAttribute,
      deletedAt: DeletedAtAttribute,
    }, {
      sequelize,
      tableName: 'Users',
      paranoid: true, // Enable paranoid mode for soft deletes
      hooks: GenerateModelShareCodeHooks(User),
    })
  }
}

User.initializeModel();

export default User;