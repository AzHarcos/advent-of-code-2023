import {readInputFile, readInputFileToLines} from '../util/read-input-file';
import {sum, max, min, sortAsc, sortDsc} from '../util/array-utils';

type Shape = 'Rock' | 'Paper' | 'Scissors';
type Outcome = 'Loss' | 'Draw' | 'Win';
type ElfOption = 'A' | 'B' | 'C';
type MyOption = 'X' | 'Y' | 'Z';

const elfChoices: Record<ElfOption, Shape> = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',
};

const myChoicesPart1: Record<MyOption, Shape> = {
  X: 'Rock',
  Y: 'Paper',
  Z: 'Scissors',
};

const myChoicesPart2: Record<MyOption, Outcome> = {
  X: 'Loss',
  Y: 'Draw',
  Z: 'Win',
};

const shapeToScore: Record<Shape, number> = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

const outcomeToScore: Record<Outcome, number> = {
  Loss: 0,
  Draw: 3,
  Win: 6,
};

const determineOutcome = (elfShape: Shape, myShape: Shape): Outcome => {
  if (elfShape === myShape) return 'Draw';

  if (elfShape === 'Rock') return myShape === 'Paper' ? 'Win' : 'Loss';

  if (elfShape === 'Paper') return myShape === 'Scissors' ? 'Win' : 'Loss';

  return myShape === 'Rock' ? 'Win' : 'Loss';
};

const determineShape = (elfShape: Shape, outcome: Outcome): Shape => {
  if (outcome === 'Draw') return elfShape;

  if (elfShape === 'Rock') return outcome === 'Loss' ? 'Scissors' : 'Paper';

  if (elfShape === 'Paper') return outcome === 'Loss' ? 'Rock' : 'Scissors';

  return outcome === 'Loss' ? 'Paper' : 'Rock';
};

const determineScorePart1 = (
  elfOption: ElfOption,
  myOption: MyOption
): number => {
  const elfShape = elfChoices[elfOption];
  const myShape = myChoicesPart1[myOption];

  if (!elfShape || !myShape) return 0;

  const outcome = determineOutcome(elfShape, myShape);

  return outcomeToScore[outcome] + shapeToScore[myShape];
};

const determineScorePart2 = (
  elfOption: ElfOption,
  myOption: MyOption
): number => {
  const elfShape = elfChoices[elfOption];
  const outcome = myChoicesPart2[myOption];

  if (!elfShape || !outcome) return 0;

  const myShape = determineShape(elfShape, outcome);

  return outcomeToScore[outcome] + shapeToScore[myShape];
};

const solveDay2 = () => {
  const strategyGuideRounds = readInputFile(2022, 2).split('\n');

  const scorePart1 = strategyGuideRounds.reduce((sum, choices) => {
    const elfChoice = choices[0] as ElfOption;
    const myChoice = choices[2] as MyOption;

    return sum + determineScorePart1(elfChoice, myChoice);
  }, 0);

  const scorePart2 = strategyGuideRounds.reduce((sum, choices) => {
    const elfChoice = choices[0] as ElfOption;
    const myChoice = choices[2] as MyOption;

    return sum + determineScorePart2(elfChoice, myChoice);
  }, 0);

  // Part 1: Score
  console.log(`Part 1: ${scorePart1}`);

  // Part 2: Score
  console.log(`Part 2: ${scorePart2}`);
};

solveDay2();
