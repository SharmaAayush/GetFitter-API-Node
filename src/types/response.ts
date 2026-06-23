interface ApiResponse<T extends object = Record<string, never>, M extends object = Record<string, never>> {
  success: boolean,
  message: string,
  data?: T | null,
  meta?: M | null,
}

export interface ApiSuccessResponse<T extends object, M extends object = Record<string, never>> extends ApiResponse<T, M> {
  success: true;
  data: T,
}

export interface ApiErrorResponse<T extends object = Record<string, never>, M extends object = Record<string, never>> extends ApiResponse<T, M> {
  success: false;
}
