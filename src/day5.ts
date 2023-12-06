import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';

type Range = {
  sourceStart: number;
  sourceEnd: number;
  targetStart: number;
  targetEnd: number;
};

type PlantMap = {
  source: string;
  target: string;
  ranges: Range[];
};

const parseRange = (rangeDescription: string): Range => {
  const [targetStart, sourceStart, length] = rangeDescription.split(' ').map(Number);

  return {
    sourceStart,
    targetStart,
    sourceEnd: sourceStart + length - 1,
    targetEnd: targetStart + length - 1,
  };
};

const parseMap = (mapDescription: string): PlantMap => {
  const lines = mapDescription.split('\n');

  const [source, _, target] = lines[0].split(' ')[0].split('-');

  const ranges = lines
    .slice(1)
    .map(parseRange)
    .sort((a, b) => a.sourceStart - b.sourceStart);

  return {
    source,
    target,
    ranges,
  };
};

const processSeed = (seed: number, maps: PlantMap[]): number => {
  let value = seed;
  for (let map of maps) {
    const range = map.ranges.find(range => range.sourceStart <= value && range.sourceEnd >= value);

    if (range) {
      value = range.targetStart + value - range.sourceStart;
    }
  }
  return value;
};

const processSeedRange = (seedRange: number[], maps: PlantMap[]): number => {
  const [start, length] = seedRange;

  console.log('starting to process', start, length);

  let min = 1000000000;

  for (let i = 0; i < length; i++) {
    const processed = processSeed(start + i, maps);
    min = Math.min(min, processed);
  }
  console.log(min);
  return min;
};

const solveDay5 = () => {
  const input = readInputFile(2023, 5).split('\n\n');

  const seeds = input[0].split(' ').slice(1).map(Number);

  const rangedSeeds = getChunks(seeds, 2);

  const maps = input.slice(1).map(parseMap);
  console.log(maps);

  //const processed = seeds.map(seed => processSeed(seed, maps));

  const processedRanges = rangedSeeds.map(seedRange => processSeedRange(seedRange, maps));

  //console.log(min(processed));

  console.log(min(processedRanges));
  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay5();
