export const sumReducer = (a: number, b: number): number => a + b;

export const mulReducer = (a: number, b: number): number => a * b;

export const sum = (nums: number[]): number => nums.reduce(sumReducer, 0);

export const mul = (nums: number[]): number => nums.reduce(mulReducer, 1);

export const max = (nums: number[]): number => Math.max(...nums);

export const min = (nums: number[]): number => Math.min(...nums);

export const sortAsc = (nums: number[]): number[] => nums.sort((a, b) => a - b);

export const sortDsc = (nums: number[]): number[] => nums.sort((a, b) => b - a);

export const getChunks = <T>(items: Array<T>, chunkSize: number): Array<Array<T>> => {
  if (chunkSize < 1) return [items];

  if (!items.length) return [];

  return [items.slice(0, chunkSize), ...getChunks(items.slice(chunkSize), chunkSize)];
};
