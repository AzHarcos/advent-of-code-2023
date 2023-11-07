import {readFileSync} from 'fs';

export const readInputFile = (year: number, day: number): string => {
  const fileName = `./input/${year}_${day}.txt`;
  return readFileSync(fileName).toString('utf8');
};

export const readInputFileToLines = (year: number, day: number): string[] => {
  return readInputFile(year, day).split('\n');
};
