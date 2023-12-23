import {readInputFile} from '../util/read-input-file';
import {sumReducer} from '../util/array-utils';

type ConditionRecord = {
  springs: string;
  damagedGroupSizes: number[];
};

const ARRANGEMENT_CACHE = new Map<string, number>();

const OPERATIONAL = '.';
const DAMAGED = '#';
const UNKNOWN = '?';

const parseConditionRecord =
  (foldCount: number) =>
  (conditionRecordDescription: string): ConditionRecord => {
    const [springs, groupDescriptions] = conditionRecordDescription.split(' ');
    const damagedGroupSizes = groupDescriptions.split(',').map(Number);

    if (foldCount <= 1) {
      return {
        springs,
        damagedGroupSizes,
      };
    }

    const unfoldedSprings = Array(foldCount).fill(springs).join('?');
    const unfoldedGroupSizes = Array(5).fill(damagedGroupSizes).flat();

    return {
      springs: unfoldedSprings,
      damagedGroupSizes: unfoldedGroupSizes,
    };
  };

const getCacheKey = ({springs, damagedGroupSizes}: ConditionRecord): string =>
  `${springs}-${JSON.stringify(damagedGroupSizes)}`;

const getOrComputeArrangementsFromCache = (conditionRecord: ConditionRecord): number => {
  const cacheKey = getCacheKey(conditionRecord);
  const cachedResult = ARRANGEMENT_CACHE.get(cacheKey);

  if (cachedResult !== undefined) return cachedResult;

  const result = getValidArrangements(conditionRecord);
  ARRANGEMENT_CACHE.set(cacheKey, result);
  return result;
};

const getValidArrangements = ({springs, damagedGroupSizes}: ConditionRecord): number => {
  // when reaching the end of the springs, arrangement is only valid if no damaged group is left
  if (springs === '') {
    return damagedGroupSizes.length > 0 ? 0 : 1;
  }

  // when no damaged group condition is left, arrangement is valid if remaining springs contain no damaged one
  if (damagedGroupSizes.length === 0) {
    return springs.includes(DAMAGED) ? 0 : 1;
  }

  const currentSpring = springs[0];
  let result = 0;

  // spring can be skipped if it is or might be operational
  if (currentSpring === OPERATIONAL || currentSpring === UNKNOWN) {
    const remainingConditionRecord = {
      springs: springs.slice(1),
      damagedGroupSizes,
    };
    result += getOrComputeArrangementsFromCache(remainingConditionRecord);
  }

  // if spring is or might be damaged, the next damaged group condition needs to be checked
  if (currentSpring === DAMAGED || currentSpring === UNKNOWN) {
    const groupSize = damagedGroupSizes[0];
    const springGroup = springs.slice(0, groupSize);

    const hasEnoughDamagedSprings = springGroup.length >= groupSize && !springGroup.includes(OPERATIONAL);
    const groupEndsAfterLastSpring = springs[groupSize] !== DAMAGED;

    // group condition can be fulfilled if the number of following damaged springs exactly matches the group size
    if (hasEnoughDamagedSprings && groupEndsAfterLastSpring) {
      const remainingConditionRecord = {
        springs: springs.slice(groupSize + 1),
        damagedGroupSizes: damagedGroupSizes.slice(1),
      };
      result += getOrComputeArrangementsFromCache(remainingConditionRecord);
    }
  }
  return result;
};

const solveDay12 = () => {
  const conditionRecordDescriptions = readInputFile(2023, 12).split('\n');

  // Part 1: possible arrangements to fulfill folded record conditions
  const possibleArrangementsForFoldedRecords = conditionRecordDescriptions
    .map(parseConditionRecord(0))
    .map(getValidArrangements)
    .reduce(sumReducer);
  console.log(`Part 1: ${possibleArrangementsForFoldedRecords}`);

  // Part 2: possible arrangements to fulfill unfolded record conditions
  const possibleArrangementsForUnfoldedRecords = conditionRecordDescriptions
    .map(parseConditionRecord(5))
    .map(getValidArrangements)
    .reduce(sumReducer);
  console.log(`Part 2: ${possibleArrangementsForUnfoldedRecords}`);
};

solveDay12();
