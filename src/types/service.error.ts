export interface ServiceError {
  reason: string,
  details: Error | object | string | unknown,
}