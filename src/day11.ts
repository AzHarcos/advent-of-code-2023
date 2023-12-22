import {readInputFile} from '../util/read-input-file';

type Grid = string[][];

type Galaxy = {
  row: number;
  col: number;
};

const GALAXY = '#';

const parseGrid = (gridDescription: string): Grid => {
  const rows = gridDescription.split('\n');
  return rows.map(row => row.split(''));
};

const findGalaxies = (grid: Grid): Galaxy[] => {
  const galaxies: Galaxy[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === GALAXY) {
        galaxies.push({
          row,
          col,
        });
      }
    }
  }
  return galaxies;
};

const getDistanceBetween = (
  start: Galaxy,
  end: Galaxy,
  expansionSize: number,
  occupiedRows: number[],
  occupiedCols: number[]
): number => {
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  const distanceBetween = maxRow - minRow + maxCol - minCol;

  const occupiedRowsBetween = occupiedRows.filter(rowIndex => rowIndex >= minRow && rowIndex < maxRow);
  const occupiedColsBetween = occupiedCols.filter(colIndex => colIndex >= minCol && colIndex < maxCol);
  const expansionCount = distanceBetween - occupiedRowsBetween.length - occupiedColsBetween.length;

  return distanceBetween + expansionCount * expansionSize;
};

const getSumOfDistances = (galaxies: Galaxy[], expansionSize: number): number => {
  const occupiedRows = new Set<number>();
  const occupiedCols = new Set<number>();

  for (const galaxy of galaxies) {
    occupiedRows.add(galaxy.row);
    occupiedCols.add(galaxy.col);
  }

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const start = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const end = galaxies[j];
      sum += getDistanceBetween(start, end, expansionSize, [...occupiedRows], [...occupiedCols]);
    }
  }

  return sum;
};

const solveDay11 = () => {
  const input = readInputFile(2023, 11);
  const grid = parseGrid(input);

  const galaxies = findGalaxies(grid);

  // Part 1: Sum of distances for expansion size 1
  console.log(`Part 1: ${getSumOfDistances(galaxies, 1)}`);

  // Part 2: Sum of distances for expansion size 999999
  console.log(`Part 2: ${getSumOfDistances(galaxies, 999999)}`);
};

solveDay11();
