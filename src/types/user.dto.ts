export interface UserModelResponse {
  email: string;
  id: string;
}

export interface UserRegisterRequest {
  email: string;
  password: string;
}