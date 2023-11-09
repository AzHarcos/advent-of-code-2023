import {readInputFile} from '../util/read-input-file';
import {sumReducer} from '../util/array-utils';

type Shape = 'Rock' | 'Paper' | 'Scissors';
type Outcome = 'Loss' | 'Draw' | 'Win';
type ElfOption = 'A' | 'B' | 'C';
type MyOption = 'X' | 'Y' | 'Z';
type GameDescription = `${ElfOption} ${MyOption}`;

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

const determineScorePart1 = (gameDescription: GameDescription): number => {
  const [elfSelection, mySelection] = gameDescription.split(' ');

  const elfShape = elfChoices[elfSelection];
  const myShape = myChoicesPart1[mySelection];

  if (!elfShape || !myShape) return 0;

  const outcome = determineOutcome(elfShape, myShape);

  return outcomeToScore[outcome] + shapeToScore[myShape];
};

const determineScorePart2 = (gameDescription: GameDescription): number => {
  const [elfSelection, mySelection] = gameDescription.split(' ');

  const elfShape = elfChoices[elfSelection];
  const outcome = myChoicesPart2[mySelection];

  if (!elfShape || !outcome) return 0;

  const myShape = determineShape(elfShape, outcome);

  return outcomeToScore[outcome] + shapeToScore[myShape];
};

const solveDay2 = () => {
  const strategyGuideRounds = readInputFile(2022, 2).split(
    '\n'
  ) as GameDescription[];

  // Part 1: Score for given shapes
  const sumForGivenShapes = strategyGuideRounds
    .map(determineScorePart1)
    .reduce(sumReducer);

  console.log(`Part 1: ${sumForGivenShapes}`);

  // Part 2: Score for given outcomes
  const sumForGivenOutcomes = strategyGuideRounds
    .map(determineScorePart2)
    .reduce(sumReducer);

  console.log(`Part 2: ${sumForGivenOutcomes}`);
};

solveDay2();
