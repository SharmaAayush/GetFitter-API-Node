import { IModelWithTransformation } from "@/types/base.models";

export async function transformModelArr<T>(modelArr: IModelWithTransformation<T>[]): Promise<T[]> {
  const data: T[] = [];
  const promises: Promise<T>[] = [];
  modelArr.forEach(model => {
    promises.push(
      model.transform().then(modelResponse => {
        data.push(modelResponse);
        return modelResponse;
      })
    )
  });
  await Promise.all(promises);
  return data;
}