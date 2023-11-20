import {readInputFile} from '../util/read-input-file';

type AssignmentDescription = `${number}-${number}`;
type AssignmentPairDescription = `${AssignmentDescription},${AssignmentDescription}`;
type AssignmentPair = [AssignmentDescription, AssignmentDescription];

type Range = {
  start: number;
  end: number;
};
type RangePair = [Range, Range];

const parseAssignmentPair = (assignmentPair: AssignmentPairDescription): AssignmentPair => assignmentPair.split(',') as AssignmentPair;

const parseRange = (assignment: AssignmentDescription): Range => {
  const [start, end] = assignment.split('-').map(Number);
  return {
    start,
    end,
  };
};

const parseRanges = (assignments: AssignmentPair): RangePair => assignments.map(parseRange) as RangePair;

const fullyContainsRange = (firstRange: Range, secondRange: Range): boolean =>
  firstRange.start <= secondRange.start && firstRange.end >= secondRange.end;

const oneFullyContainsOther = ([firstRange, secondRange]: RangePair): boolean => {
  return fullyContainsRange(firstRange, secondRange) || fullyContainsRange(secondRange, firstRange);
};

const hasOverlap = ([firstRange, secondRange]: RangePair): boolean => {
  const isFullySmaller = firstRange.end < secondRange.start;
  const isFullyLarger = firstRange.start > secondRange.end;

  return !isFullySmaller && !isFullyLarger;
};

const solveDay4 = () => {
  const assignmentPairs = readInputFile(2022, 4).split('\n') as AssignmentPairDescription[];

  const rangesPerLine = assignmentPairs.map(parseAssignmentPair).map(parseRanges);

  // Part 1: Number of fully contained ranges
  const fullyContainedRangesCount = rangesPerLine.filter(oneFullyContainsOther).length;
  console.log(`Part 1: ${fullyContainedRangesCount}`);

  // Part 2: Number of overlapping ranges
  const overlappingRangesCount = rangesPerLine.filter(hasOverlap).length;
  console.log(`Part 2: ${overlappingRangesCount}`);
};

solveDay4();
