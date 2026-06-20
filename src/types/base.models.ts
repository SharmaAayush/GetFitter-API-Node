export interface IModelWithAssociations {
  associate(): void;
}

export interface IModelWithInitialization {
  initializeModel(): void;
}

export interface IModelWithTransformation<T> {
  transform(): T;
}

export function ModelWithAssociations<T extends IModelWithAssociations>() {
  return (_constructor: T) => {};
}

export function ModelWithInitialization<T extends IModelWithInitialization>() {
  return (_constructor: T) => {};
}

export function ModelWithTransformation<T>() {
  // It returns a class validator constrained to an instance matching IMovementInstance<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <U extends new (...args: any[]) => IModelWithTransformation<T>>(constructor: U) => {
    return constructor;
  };
}