import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';
import {Dir} from 'fs';
import {dir} from 'console';

type Coord = `${number}/${number}`;

type DistanceMap = Record<Coord, number>;

type Direction = {
  straight?: boolean;
  ground?: boolean;
  start?: boolean;
  x: number;
  y: number;
};

type Cell = {
  direction: Direction;
  r: number;
  c: number;
};

const directions = [
  {row: -1, col: 0},
  {row: 0, col: -1},
  {row: 0, col: 1},
  {row: 1, col: 0},
];

const directionMap: Record<string, Direction> = {
  '|': {
    straight: true,
    x: 0,
    y: 1,
  },
  '-': {
    straight: true,
    x: 1,
    y: 0,
  },
  L: {
    x: 1,
    y: -1,
  },
  J: {
    x: -1,
    y: -1,
  },
  '7': {
    x: -1,
    y: 1,
  },
  F: {
    x: 1,
    y: 1,
  },
  '.': {
    ground: true,
    x: 0,
    y: 0,
  },
  S: {
    start: true,
    x: 0,
    y: 0,
  },
};

const cellToCoords = (cell: Cell): string => `${cell.r}/${cell.c}`;

const findShapeOfStart = (grid: Cell[][], start: Cell): Direction => {
  const adjacentCells = directions
    .map(d => ({
      direction: d,
      cell: grid[start.r + d.row]?.[start.c + d.col],
    }))
    .filter(
      c =>
        c.cell &&
        !c.cell.direction.ground &&
        (c.cell.c + c.cell.direction.x === start.c || c.cell.r + c.cell.direction.y === start.r)
    )
    .map(res => ({
      r: res.direction.row,
      c: res.direction.col,
    }))
    .reduce(
      (acc, curr) => {
        return {...acc, r: acc.r + curr.r, c: acc.c + curr.c};
      },
      {r: 0, c: 0}
    );

  if (adjacentCells.r === 2) {
    return directionMap['-'];
  }

  if (adjacentCells.c === 2) {
    return directionMap['|'];
  }

  return (
    Object.values(directionMap).find(d => d.x === adjacentCells.c && d.y === adjacentCells.r) ??
    directionMap['S']
  );
};

const solveDay10 = () => {
  const input: string[][] = readInputFile(2023, 10)
    .split('\n')
    .map(line => line.split(''));

  const grid: Cell[][] = [];

  let newlyVisited: Cell[] = [];

  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[r].length; c++) {
      const cell = input[r][c];
      const parsedCell: Cell = {
        direction: directionMap[cell],
        r,
        c,
      };
      if (cell === 'S') {
        newlyVisited.push(parsedCell);
      }
      if (!grid[r]) {
        grid.push([parsedCell]);
      } else {
        grid[r].push(parsedCell);
      }
    }
  }

  const startCell = newlyVisited[0];
  startCell.direction = findShapeOfStart(grid, startCell);

  const distanceMap: DistanceMap = {
    [cellToCoords(startCell)]: 0,
  };

  while (newlyVisited.length > 0) {
    const nextVisited: Cell[] = [];
    for (let cell of newlyVisited) {
      const distance = distanceMap[cellToCoords(cell)];
      let nextCells: Cell[] = [];
      if (cell.direction.straight) {
        nextCells = [
          grid[cell.r + cell.direction.y]?.[cell.c + cell.direction.x],
          grid[cell.r + -1 * cell.direction.y]?.[cell.c + -1 * cell.direction.x],
        ];
      } else {
        nextCells = [grid[cell.r + cell.direction.y]?.[cell.c], grid[cell.r]?.[cell.c + cell.direction.x]];
      }
      nextCells = nextCells.filter(cell => !cell.direction.ground && !distanceMap[cellToCoords(cell)]);
      nextVisited.push(...nextCells);
      for (cell of nextCells) {
        distanceMap[cellToCoords(cell)] = Math.min(distanceMap[cellToCoords(cell)] ?? Infinity, distance + 1);
      }
    }
    newlyVisited = [...nextVisited];
  }

  const loopCells = Object.keys(distanceMap).map(coord => ({
    row: Number(coord.split('/')[0]),
    col: Number(coord.split('/')[1]),
  }));

  type RowMap = Record<number, number[]>;

  const rowsToCells: RowMap = loopCells.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.row]: acc[curr.row] ? [...acc[curr.row], curr.col] : [curr.col],
    };
  }, {});

  const rowsInLoop = Object.keys(rowsToCells).map(Number);
  const [minRow, maxRow] = [min(rowsInLoop), max(rowsInLoop)];

  type CellArea = {
    isEnclosed: boolean;
    cells: Cell[];
  };
  type EnclosedMap = Record<Coord, CellArea>;
  const enclosedMap: EnclosedMap = {};

  for (let r = minRow; r <= maxRow; r++) {
    const loopCols = rowsToCells[r];
    const [minCol, maxCol] = [min(loopCols), max(loopCols)];

    for (let c = minCol; c <= maxCol; c++) {
      if (!rowsToCells[r].includes(c) && grid[r][c].direction.ground) {
        const adjacentCells = Object.entries(enclosedMap).filter(([_, area]) =>
          area.cells.some(cell => (cell.r === r - 1 && cell.c === c) || (cell.c === c - 1 && cell.r === r))
        );

        const isEnclosed = r !== minRow && r !== maxRow && c !== minCol && c !== maxCol;
        if (adjacentCells.length === 0) {
          enclosedMap[cellToCoords(grid[r][c])] = {
            isEnclosed,
            cells: [grid[r][c]],
          };
        } else if (adjacentCells.length === 1) {
          const startCoords = adjacentCells[0][0];
          enclosedMap[startCoords].isEnclosed = isEnclosed && enclosedMap[startCoords].isEnclosed;
          enclosedMap[startCoords].cells.push(grid[r][c]);
        } else {
          const startCoords = adjacentCells[0][0];
          const deleteCoords = adjacentCells[1][0];

          enclosedMap[startCoords].isEnclosed = isEnclosed && enclosedMap[startCoords].isEnclosed;
          enclosedMap[startCoords].cells.push(...adjacentCells[1][1].cells);
          enclosedMap[startCoords].cells.push(grid[r][c]);

          delete enclosedMap[deleteCoords];
        }
      }
    }
  }

  console.log(enclosedMap);

  const enclosedCellCount = Object.values(enclosedMap)
    .filter(area => area.isEnclosed)
    .map(area => area.cells.length)
    .reduce(sumReducer);

  console.log(enclosedCellCount);

  console.log(max(Object.values(distanceMap)));
  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay10();
