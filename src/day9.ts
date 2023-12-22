import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';
import {after} from 'node:test';

const solveDay9 = () => {
  const input = readInputFile(2023, 9).split('\n');

  const nextVals: number[] = [];
  for (let seq of input) {
    const seqNum = seq.split(' ').map(Number);
    let differences: number[] = [...seqNum];
    const allDiffs: number[][] = [seqNum];
    let done = false;

    while (!done) {
      const updatedDiffs: number[] = [];
      for (let i = 1; i < differences.length; i++) {
        updatedDiffs.push(differences[i] - differences[i - 1]);
      }
      allDiffs.push(updatedDiffs);
      differences = updatedDiffs;
      done = updatedDiffs.every(d => d === 0);
    }

    for (let i = allDiffs.length - 2; i >= 0; i--) {
      const currDiffs = allDiffs[i];
      const afterDiffs = allDiffs[i + 1];

      allDiffs[i].push(currDiffs[currDiffs.length - 1] + afterDiffs[afterDiffs.length - 1]);
    }

    nextVals.push(allDiffs.at(0)?.at(-1) ?? 0);
  }

  console.log(sum(nextVals));

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

const solveDay9_2 = () => {
  const input = readInputFile(2023, 9).split('\n');

  const nextVals: number[] = [];
  for (let seq of input) {
    const seqNum = seq.split(' ').map(Number);
    let differences: number[] = [...seqNum];
    let allDiffs: number[][] = [seqNum];
    let done = false;

    while (!done) {
      const updatedDiffs: number[] = [];
      for (let i = differences.length - 1; i > 0; i--) {
        updatedDiffs.push(differences[i] - differences[i - 1]);
      }
      allDiffs.push([...updatedDiffs.reverse()]);
      differences = updatedDiffs;
      done = updatedDiffs.every(d => d === 0);
    }
    console.log(allDiffs);

    for (let i = allDiffs.length - 2; i >= 0; i--) {
      const currDiffs = allDiffs[i];
      const afterDiffs = allDiffs[i + 1];
      allDiffs[i] = [currDiffs[0] - afterDiffs[0], ...allDiffs[i]];
    }
    console.log(allDiffs);

    nextVals.push(allDiffs.at(0)?.at(0) ?? 0);
  }

  console.log(nextVals);
  console.log(sum(nextVals));

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay9_2();
