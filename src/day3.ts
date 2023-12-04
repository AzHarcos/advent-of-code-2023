import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';

type Direction = {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
};

const directions: Direction[] = [
  {
    x: -1,
    y: -1,
  },
  {
    x: -1,
    y: 0,
  },
  {
    x: -1,
    y: 1,
  },
  {
    x: 0,
    y: -1,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
];

const getNumberStartingAt = (grid: string[][], i: number, j: number): number => {
  let numberStr = '';
  let index = j;
  while (index < grid.length && /\d/.test(grid[i][index])) {
    numberStr += grid[i][index];
    index++;
  }

  index = j - 1;
  while (index >= 0 && /\d/.test(grid[i][index])) {
    numberStr = `${grid[i][index]}${numberStr}`;
    index--;
  }

  return Number(numberStr);
};

const getGearRatio = (grid: string[][], i: number, j: number): number => {
  const numbers = directions
    .map(direction => ({
      x: i + direction.x,
      y: j + direction.y,
      symbol: grid[i + direction.x][j + direction.y],
    }))
    .filter(num => /\d/.test(num.symbol));

  const filNums = numbers.filter(num => !numbers.some(n => n.x === num.x && n.y - 1 === num.y));

  if (filNums.length !== 2) return 0;

  return mul(filNums.map(num => getNumberStartingAt(grid, num.x, num.y)));
};

const solveDay3 = () => {
  const rows = readInputFile(2023, 3).split('\n');

  const grid: string[][] = rows.map(row => [...row]);

  let currNumber = '';
  let numbers: number[] = [];
  let touchesSymbol = false;
  let gears: number[] = [];

  for (let i = 0; i < grid.length; i++) {
    currNumber = '';
    touchesSymbol = false;
    for (let j = 0; j < grid[i].length; j++) {
      const char = grid[i][j];

      if (char === '*') {
        gears.push(getGearRatio(grid, i, j));
      }

      if (/\d/.test(char)) {
        currNumber += char;
        if (!touchesSymbol) {
          touchesSymbol = directions.some(direction => {
            const adjacentChar = grid[i + direction.y]?.[j + direction.x];

            return adjacentChar !== undefined && !/(\d|\.)/.test(adjacentChar);
          });
        }
      } else if (currNumber.length > 0) {
        if (touchesSymbol) {
          numbers.push(Number(currNumber));
        }
        currNumber = '';
        touchesSymbol = false;
      }
    }
    if (touchesSymbol) {
      numbers.push(Number(currNumber));
    }
    currNumber = '';
    touchesSymbol = false;
  }

  console.log(numbers);
  console.log(sum(numbers));

  console.log(gears);
  console.log(sum(gears));

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay3();
