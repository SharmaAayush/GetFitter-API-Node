interface ApiResponse<T> {
  success: boolean,
  message: string,
  data?: T | null,
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T,
} 

export interface ApiErrorResponse<T> extends ApiResponse<T> {
  success: false;
}
