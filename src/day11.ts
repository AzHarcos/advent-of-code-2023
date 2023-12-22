import {readInputFile} from '../util/read-input-file';

type RowDescription = {
  index: number;
  row: string;
};

type ColDescription = {
  index: number;
  col: string[];
};

type Galaxy = {
  row: number;
  col: number;
};

const EMPTY = '.';
const GALAXY = '#';
const EXPANSION = 'E';

const parseGrid = (gridDescription: string): string[][] => {
  const rows = gridDescription.split('\n');
  const grid = rows.map(row => row.split(''));

  const emptyRows: RowDescription[] = rows
    .map((row, i) => ({
      index: i,
      row,
    }))
    .filter(elem => !elem.row.includes(GALAXY));

  const emptyCols: ColDescription[] = [];
  for (let c = 0; c < grid[0].length; c++) {
    const col = grid.reduce((acc, row) => {
      return [...acc, row[c]];
    }, []);
    if (col.every(elem => elem === EMPTY)) {
      emptyCols.push({
        index: c,
        col,
      });
    }
  }

  let counter = 1;
  for (const emptyRow of emptyRows) {
    grid.splice(emptyRow.index + counter++, 0, Array(grid[0].length).fill(EXPANSION));
  }

  counter = 1;
  for (const emptyCol of emptyCols) {
    for (let r = 0; r < grid.length; r++) {
      grid[r].splice(emptyCol.index + counter, 0, EXPANSION);
    }
    counter++;
  }

  return grid;
};

const findGalaxies = (grid: string[][], expansionSize: number): Galaxy[] => {
  const galaxies: Galaxy[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === GALAXY) {
        const colGaps = grid[row].slice(0, col).filter(char => char === EXPANSION).length;
        const rowGaps = grid.slice(0, row).filter(row => row[col] === EXPANSION).length;
        galaxies.push({
          row: row + rowGaps * expansionSize - rowGaps,
          col: col + colGaps * expansionSize - colGaps,
        });
      }
    }
  }
  return galaxies;
};

const getDistanceBetween = (start: Galaxy, end: Galaxy): number =>
  Math.abs(start.row - end.row) + Math.abs(start.col - end.col);

const getSumOfDistances = (galaxies: Galaxy[]): number => {
  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += getDistanceBetween(galaxies[i], galaxies[j]);
    }
  }

  return sum;
};

const solveDay11 = () => {
  const input = readInputFile(2023, 11);
  const grid = parseGrid(input);

  const galaxiesPart1 = findGalaxies(grid, 1);
  const galaxiesPart2 = findGalaxies(grid, 999999);

  // Part 1:
  console.log(`Part 1: ${getSumOfDistances(galaxiesPart1)}`);

  // Part 2:
  console.log(`Part 2: ${getSumOfDistances(galaxiesPart2)}`);
};

solveDay11();
