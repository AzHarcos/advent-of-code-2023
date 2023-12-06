import {readInputFile} from '../util/read-input-file';
import {sum, mul, sumReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';

type Grid = string[][];

type CoordinateString = `${number}/${number}`;

type CoordinatesToAdjacentNumbers = Record<CoordinateString, number[]>;

type Cell = {
  content?: string;
  row: number;
  col: number;
};

type Direction = {
  row: -1 | 0 | 1;
  col: -1 | 0 | 1;
};

const directions: Direction[] = [
  {row: -1, col: -1},
  {row: -1, col: 0},
  {row: -1, col: 1},
  {row: 0, col: -1},
  {row: 0, col: 1},
  {row: 1, col: -1},
  {row: 1, col: 0},
  {row: 1, col: 1},
];

const isSymbol = (cell: Cell): boolean => !!cell.content && /^[^\d.]$/.test(cell.content);

const isStarSymbol = (cell: Cell): boolean => cell.content === '*';

const isGear = (adjacentNumbers: number[]) => adjacentNumbers.length === 2;

const getGearPower = (adjacentNumbers: number[]) => mul(adjacentNumbers);

const cellToCoordinateString = (cell: Cell): CoordinateString => `${cell.row}/${cell.col}`;

const getAdjacentCells = (grid: Grid, cell: Cell): Cell[] => {
  return directions.map(direction => ({
    row: cell.row + direction.row,
    col: cell.col + direction.col,
    content: grid[cell.row + direction.row]?.[cell.col + direction.col],
  }));
};

const solveDay3 = () => {
  const rows = readInputFile(2023, 3).split('\n');

  const grid = rows.map(row => row.split(''));

  let numberString = '';
  let touchesSymbol = false;

  let partNumbers: number[] = [];
  let adjacentStars = new Set<CoordinateString>();
  let starCellsToAdjacentNumbers: CoordinatesToAdjacentNumbers = {};

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const char = grid[row][col];

      if (isDigit(char)) {
        numberString += char;

        const adjacentCells = getAdjacentCells(grid, {row, col});
        touchesSymbol = touchesSymbol || adjacentCells.some(isSymbol);
        adjacentCells.filter(isStarSymbol).forEach(cell => adjacentStars.add(cellToCoordinateString(cell)));
      } else {
        if (numberString.length > 0 && touchesSymbol) {
          const partNumber = Number(numberString);
          partNumbers.push(partNumber);

          adjacentStars.forEach(starCoordinates => {
            const adjacentNumbers = starCellsToAdjacentNumbers[starCoordinates] ?? [];
            starCellsToAdjacentNumbers[starCoordinates] = [...adjacentNumbers, partNumber];
          });
        }
        numberString = '';
        touchesSymbol = false;
        adjacentStars.clear();
      }
    }
    if (numberString.length > 0 && touchesSymbol) {
      const partNumber = Number(numberString);
      partNumbers.push(partNumber);

      adjacentStars.forEach(starCoordinates => {
        const adjacentNumbers = starCellsToAdjacentNumbers[starCoordinates] ?? [];
        starCellsToAdjacentNumbers[starCoordinates] = [...adjacentNumbers, partNumber];
      });
    }
    numberString = '';
    touchesSymbol = false;
    adjacentStars.clear();
  }

  // Part 1: Sum of part numbers (numbers adjacent to at least 1 symbol)
  console.log(`Part 1: ${sum(partNumbers)}`);

  // Part 2: Sum of gear ratios (products of numbers adjacent to * symbols with exactly 2 adjacent numbers)
  const sumOfGearPowers = Object.values(starCellsToAdjacentNumbers)
    .filter(isGear)
    .map(getGearPower)
    .reduce(sumReducer);
  console.log(`Part 2: ${sumOfGearPowers}`);
};

solveDay3();
