import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';

const solveDay6 = () => {
  const input = readInputFile(2023, 6).split('\n');

  const times = input[0].split(' ').slice(1).filter(Boolean).map(Number);

  const distances = input[1].split(' ').slice(1).filter(Boolean).map(Number);

  const ways: number[] = [];

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    let waysOfRace = 0;

    for (let h = 1; h < time; h++) {
      const travel = (time - h) * h;
      if (travel > distance) {
        waysOfRace++;
      }
    }

    ways.push(waysOfRace);
  }

  console.log(times, distances);

  console.log(mul(ways));

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

const solveDay62 = () => {
  const input = readInputFile(2023, 6).split('\n');

  const time = Number(input[0].split(' ').slice(1).filter(Boolean).join(''));

  const distance = Number(input[1].split(' ').slice(1).filter(Boolean).join(''));

  let waysOfRace = 0;

  for (let h = 1; h < time; h++) {
    const travel = (time - h) * h;
    if (travel > distance) {
      waysOfRace++;
    }
  }

  console.log(waysOfRace);

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay62();
