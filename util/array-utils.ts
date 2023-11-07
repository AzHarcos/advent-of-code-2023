export const sum = (nums: number[]): number => nums.reduce((a, b) => a + b);

export const max = (nums: number[]): number => Math.max(...nums);

export const min = (nums: number[]): number => Math.min(...nums);

export const sortAsc = (nums: number[]): number[] => nums.sort((a, b) => a - b);

export const sortDsc = (nums: number[]): number[] => nums.sort((a, b) => b - a);
