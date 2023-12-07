import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';

const findNumberOfWaysToWin = (time: number, distance: number): number => {
  const rootTerm = Math.sqrt((time / 2) ** 2 - distance);

  const highestWinningChargeTime = time / 2 + rootTerm;
  const lowestWinningChargeTime = time / 2 - rootTerm;

  return Math.floor(highestWinningChargeTime) - Math.ceil(lowestWinningChargeTime) + 1;
};

const solveDay6 = () => {
  const input = readInputFile(2023, 6).split('\n');

  const times = input[0].split(' ').slice(1).filter(Boolean).map(Number);

  const distances = input[1].split(' ').slice(1).filter(Boolean).map(Number);

  const ways: number[] = [];

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    ways.push(findNumberOfWaysToWin(time, distance));
  }

  console.log(times, distances);

  console.log(mul(ways));

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

const solveDay6_2 = () => {
  const input = readInputFile(2023, 6).split('\n');

  const time = Number(input[0].split(' ').slice(1).filter(Boolean).join(''));

  const distance = Number(input[1].split(' ').slice(1).filter(Boolean).join(''));

  // T = total time, t = charge time, d = distance: f(t) = (T - t) * t = d
  //                                             => f(t) = -t^2 + T*t - d = 0 => T und d gegeben also nach t lösen
  //                                             => f(t) = t^2 - T*t + d = 0 => pq Formel, p = -T, q = d
  //                                                     => T/2 +- root((-T/2)^2-d) => T / 2 +- root((T/2)^2-d)

  const maxTime = time / 2 + Math.sqrt((time / 2) ** 2 - distance);

  const minTime = time / 2 - Math.sqrt((time / 2) ** 2 - distance);

  const waysToWin = Math.floor(maxTime) - Math.ceil(minTime) + 1;

  console.log(findNumberOfWaysToWin(time, distance));

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay6();
solveDay6_2();
