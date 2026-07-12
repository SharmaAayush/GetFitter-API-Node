import { UserModelResponse } from '@/types/user.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserModelResponse;
    }
  }
}