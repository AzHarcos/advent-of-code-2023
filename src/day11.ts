import {readInputFile} from '../util/read-input-file';

type Grid = string[][];

type Galaxy = {
  row: number;
  col: number;
};

type Expansions = {
  rows: number[];
  cols: number[];
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

const findExpansions = (grid: Grid, galaxies: Galaxy[]): Expansions => {
  const occupiedRows = new Set<number>();
  const occupiedCols = new Set<number>();

  for (const galaxy of galaxies) {
    occupiedRows.add(galaxy.row);
    occupiedCols.add(galaxy.col);
  }

  const emptyRows = grid.map((_, rowIndex) => rowIndex).filter(rowIndex => !occupiedRows.has(rowIndex));
  const emptyCols = grid[0].map((_, colIndex) => colIndex).filter(colIndex => !occupiedCols.has(colIndex));

  return {
    rows: emptyRows,
    cols: emptyCols,
  };
};

const getDistanceBetween = (
  start: Galaxy,
  end: Galaxy,
  expansions: Expansions,
  expansionSize: number
): number => {
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  const expansionRows = expansions.rows.filter(rowIndex => rowIndex > minRow && rowIndex < maxRow);
  const expansionCols = expansions.cols.filter(colIndex => colIndex > minCol && colIndex < maxCol);
  const expansionCount = expansionRows.length + expansionCols.length;

  return maxRow - minRow + maxCol - minCol + expansionCount * expansionSize;
};

const getSumOfDistances = (galaxies: Galaxy[], expansions: Expansions, expansionSize: number): number => {
  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += getDistanceBetween(galaxies[i], galaxies[j], expansions, expansionSize);
    }
  }

  return sum;
};

const solveDay11 = () => {
  const input = readInputFile(2023, 11);
  const grid = parseGrid(input);

  const galaxies = findGalaxies(grid);

  const expansions = findExpansions(grid, galaxies);

  // Part 1:
  console.log(`Part 1: ${getSumOfDistances(galaxies, expansions, 1)}`);

  // Part 2:
  console.log(`Part 2: ${getSumOfDistances(galaxies, expansions, 999999)}`);
};

solveDay11();
