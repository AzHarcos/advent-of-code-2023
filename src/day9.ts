import {readInputFile} from '../util/read-input-file';

type Direction = 'U' | 'R' | 'D' | 'L';
type PositionDescription = `${number}/${number}`;

type Move = {
  direction: Direction;
  distance: number;
};

type Position = {
  x: number;
  y: number;
};

type Step = {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
};

const directionToStep: Record<Direction, Step> = {
  U: {
    x: 1,
    y: 0,
  },
  R: {
    x: 0,
    y: 1,
  },
  D: {
    x: -1,
    y: 0,
  },
  L: {
    x: 0,
    y: -1,
  },
};

const START_POSITION = {
  x: 0,
  y: 0,
};

const parseMove = (moveDescription: string): Move => {
  const words = moveDescription.split(' ');

  return {
    direction: words[0] as Direction,
    distance: Number(words[1]),
  };
};

const mapMoveToSteps = (move: Move): Step[] => {
  return Array(move.distance).fill(directionToStep[move.direction]);
};

const getPositionDescription = (position: Position): PositionDescription => `${position.x}/${position.y}`;

const findPositionsVisitedByTail = (knotCount: number, moves: Move[]): Set<PositionDescription> => {
  const knotPositions = Array(knotCount).fill({...START_POSITION});
  const positionsVisitedByTail = new Set<PositionDescription>();

  const steps = moves.flatMap(mapMoveToSteps);

  for (let step of steps) {
    for (let i = 0; i < knotPositions.length; i++) {
      const isHead = i === 0;

      if (isHead) {
        knotPositions[i] = moveHead(knotPositions[i], step);
        continue;
      }

      const isTail = i === knotPositions.length - 1;
      knotPositions[i] = moveTail(knotPositions[i - 1], knotPositions[i]);

      if (isTail) {
        positionsVisitedByTail.add(getPositionDescription(knotPositions[i]));
      }
    }
  }

  return positionsVisitedByTail;
};

const moveHead = (position: Position, step: Step): Position => {
  return {
    x: position.x + step.x,
    y: position.y + step.y,
  };
};

const moveTail = (head: Position, tail: Position): Position => {
  const xDiff = Math.abs(head.x - tail.x);
  const yDiff = Math.abs(head.y - tail.y);

  const positionsAreAdjacent = xDiff < 2 && yDiff < 2;

  if (positionsAreAdjacent) return tail;

  const moveToSameColumn = xDiff > yDiff;
  const moveToSameRow = xDiff < yDiff;

  const moveUp = head.x > tail.x;
  const adjacentRow = moveUp ? head.x - 1 : head.x + 1;

  if (moveToSameColumn) {
    return {
      x: adjacentRow,
      y: head.y,
    };
  }

  const moveRight = head.y > tail.y;
  const adjacentColumn = moveRight ? head.y - 1 : head.y + 1;

  if (moveToSameRow) {
    return {
      x: head.x,
      y: adjacentColumn,
    };
  }

  return {
    x: adjacentRow,
    y: adjacentColumn,
  };
};

const solveDay9 = () => {
  const moves = readInputFile(2022, 9).split('\n').map(parseMove);

  // Part 1: Number of positions visited by tail of rope with two knots
  const positionsVisitedByTailOf2Knots = findPositionsVisitedByTail(2, moves);
  console.log(`Part 1: ${positionsVisitedByTailOf2Knots.size}`);

  // Part 2: Number of positions visited by tail of rope with 10 knots
  const positionsVisitedByTailOf10Knots = findPositionsVisitedByTail(10, moves);
  console.log(`Part 2: ${positionsVisitedByTailOf10Knots.size}`);
};

solveDay9();

/* Functional solution with much worse performance:

type RopeState = {
  positionsVisitedByTail: Record<PositionDescription, Position>;
  knotPositions: Position[];
};

const moveKnot = (index: number, knotPositions: Position[], step: Step): Position[] => {
  const isHead = index === 0;

  if (isHead) {
    const updatedHead = moveHead(knotPositions[0], step);
    return [updatedHead, ...knotPositions.slice(1)];
  }

  const previousKnots = knotPositions.slice(0, index);
  const followingKnots = knotPositions.slice(index + 1);

  const updatedKnot = moveTail(knotPositions[index - 1], knotPositions[index]);

  return [...previousKnots, updatedKnot, ...followingKnots];
};

const moveRope = (knotPositions: Position[], step: Step): Position[] => {
  return knotPositions.reduce((updatedPositions, _, index) => {
    return moveKnot(index, updatedPositions, step);
  }, knotPositions);
};

const findPositionsVisitedByTail = (knotCount: number, moves: Move[]): Set<Position> => {
  const startPositions = Array(knotCount).fill({...START_POSITION});

  const steps = moves.flatMap(mapMoveToSteps);

  const finalRopeState = steps.reduce<RopeState>(
    (acc, step, i) => {
      const updatedKnotPositions = moveRope(acc.knotPositions, step);
      const tailPosition = updatedKnotPositions[updatedKnotPositions.length - 1];

      return {
        positionsVisitedByTail: {
          ...acc.positionsVisitedByTail,
          [getPositionDescription(tailPosition)]: tailPosition,
        },
        knotPositions: updatedKnotPositions,
      };
    },
    {
      positionsVisitedByTail: {},
      knotPositions: startPositions,
    }
  );

  return new Set(Object.values(finalRopeState.positionsVisitedByTail));
};

*/
