import { errAsync, okAsync } from "neverthrow";
import bcrypt from 'bcrypt';

import { ERROR_REASONS } from "@/consts/error-reasons";
import logger from "@/services/logger";
import { UserRegisterRequest } from "@/types/user.dto";
import User from "@/models/user.model";

export class UserService {
  async registerUser(user: UserRegisterRequest) {
    try {
      const { email, password } = user;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errAsync({
          reason: ERROR_REASONS.BAD_REQUEST,
          details: 'Email already in use',
        } as const);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });

      return okAsync(await newUser.transform());
    } catch (error) {
      logger.error(`UserService.registerUser: Error registering user`);
      logger.debug(error);
      return errAsync({
        reason: ERROR_REASONS.INTERNAL_SERVER_ERROR,
        details: error,
      } as const);
    }
  }
}