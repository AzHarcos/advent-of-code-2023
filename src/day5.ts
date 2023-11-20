import {readInputFileRaw} from '../util/read-input-file';

type Stack = string;
type Stacks = Stack[];

type Move = {
  count: number;
  source: number;
  target: number;
};

const parseCargoOfLine = (line: string): string[] => {
  return [...line].filter((_, index) => index % 4 === 1);
};

const parseStacks = (input: string): Stacks => {
  const lines = input.split('\n').slice(0, -1);

  const cargoPerLine = lines.map(parseCargoOfLine);

  const stacks = cargoPerLine.reduce((stacks, cargo) => {
    return stacks.map((stack, index) => {
      if (cargo[index] === ' ') return stack;

      return `${stack}${cargo[index]}`;
    });
  }, Array(cargoPerLine[0].length).fill(''));

  return stacks;
};

const parseMove = (moveDescription: string): Move => {
  const words = moveDescription.split(' ');

  return {
    count: Number(words[1]),
    source: Number(words[3]) - 1,
    target: Number(words[5]) - 1,
  };
};

const getCargoToMove = (stack: Stack, count: number, moveMultiple: boolean): string => {
  const cargoToMove = stack.slice(0, count);

  if (moveMultiple) return cargoToMove;

  return [...cargoToMove].reverse().join('');
};

const executeMove =
  (moveMultiple = false) =>
  (stacks: Stacks, move: Move): Stacks => {
    const cargoToMove = getCargoToMove(stacks[move.source], move.count, moveMultiple);

    const updatedSource = stacks[move.source].slice(move.count);
    const updatedTarget = `${cargoToMove}${stacks[move.target]}`;

    const [firstIndex, secondIndex, updatedFirst, updatedSecond] =
      move.source < move.target
        ? [move.source, move.target, updatedSource, updatedTarget]
        : [move.target, move.source, updatedTarget, updatedSource];

    const stacksBefore = stacks.slice(0, firstIndex);
    const stacksBetween = stacks.slice(firstIndex + 1, secondIndex);
    const stacksAfter = stacks.slice(secondIndex + 1);

    return [...stacksBefore, updatedFirst, ...stacksBetween, updatedSecond, ...stacksAfter];
  };

const getTopOfStacks = (stacks: Stacks): string => {
  return stacks.map(stack => stack[0]).join('');
};

const solveDay5 = () => {
  const [stackInput, moveInput] = readInputFileRaw(2022, 5).split('\n\n');

  const stacks = parseStacks(stackInput);
  const moves = moveInput.split('\n').map(parseMove);

  // Part 1: Top of stacks after rearranging one item at a time
  const rearrangedStacksSingle = moves.reduce(executeMove(), stacks);
  console.log(`Part 1: ${getTopOfStacks(rearrangedStacksSingle)}`);

  // Part 2: Top of stacks after rearranging multiple items at once
  const rearrangedStacksMulti = moves.reduce(executeMove(true), stacks);
  console.log(`Part 2: ${getTopOfStacks(rearrangedStacksMulti)}`);
};

solveDay5();
