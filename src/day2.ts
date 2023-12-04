import {readInputFile} from '../util/read-input-file';
import {sumReducer} from '../util/array-utils';

type Color = 'red' | 'green' | 'blue';

type ColorCount = {
  color: Color;
  count: number;
};

type CombinedColorCounts = {
  [color in Color]: number;
};

type GameSummary = {gameId: number; highestColorCounts: CombinedColorCounts};

const RED_TOTAL = 12;
const GREEN_TOTAL = 13;
const BLUE_TOTAL = 14;

const parseGameId = (gameHeader: string): number => {
  const [_, gameIdString] = gameHeader.split(' ');
  return Number(gameIdString);
};

const parseColorCount = (colorCountDescription: string): ColorCount => {
  const [countString, color] = colorCountDescription.split(' ');

  return {
    color: color as Color,
    count: Number(countString),
  };
};

const parseColorCounts = (gameResult: string): ColorCount[] => {
  const rounds = gameResult.split('; ');
  const colorCountDescriptions = rounds.flatMap(round => round.split(', '));
  return colorCountDescriptions.map(parseColorCount);
};

const getHighestColorCounts = (colorCounts: ColorCount[]): CombinedColorCounts => {
  return colorCounts.reduce(
    (highestCounts, colorCount) => {
      const {color, count} = colorCount;
      const higherCount = Math.max(highestCounts[color], count);

      return {
        ...highestCounts,
        [color]: higherCount,
      };
    },
    {red: 0, green: 0, blue: 0}
  );
};

const getGameSummary = (gameDescription: string): GameSummary => {
  const [gameHeader, gameResult] = gameDescription.split(': ');

  const gameId = parseGameId(gameHeader);
  const colorCounts = parseColorCounts(gameResult);
  const highestColorCounts = getHighestColorCounts(colorCounts);

  return {
    gameId,
    highestColorCounts,
  };
};

const hasValidColorCounts = (colorCounts: CombinedColorCounts): boolean => {
  return colorCounts.red <= RED_TOTAL && colorCounts.green <= GREEN_TOTAL && colorCounts.blue <= BLUE_TOTAL;
};

const getSetPower = (colorCounts: CombinedColorCounts): number => {
  return colorCounts.red * colorCounts.green * colorCounts.blue;
};

const solveDay2 = () => {
  const gameDescriptions = readInputFile(2023, 2).split('\n');

  const gameSummaries = gameDescriptions.map(getGameSummary);

  // Part 1: Sum of game ids of valid games
  const sumOfIdsOfValidGames = gameSummaries
    .filter(gameSummary => hasValidColorCounts(gameSummary.highestColorCounts))
    .map(gameSummary => gameSummary.gameId)
    .reduce(sumReducer);
  console.log(`Part 1: ${sumOfIdsOfValidGames}`);

  // Part 2: Sum of set powers of all games
  const sumOfSetPowers = gameSummaries
    .map(gameSummary => getSetPower(gameSummary.highestColorCounts))
    .reduce(sumReducer);
  console.log(`Part 2: ${sumOfSetPowers}`);
};

solveDay2();
