export interface BaseModel {
  new (...args: any[]): any; // Constructor requirement
  associate(): void;
}