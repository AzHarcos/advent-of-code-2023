import {readInputFile} from '../util/read-input-file';
import {getChunks, sumReducer} from '../util/array-utils';

const UPPERCASE_OFFSET = 'A'.charCodeAt(0) - 27;
const LOWERCASE_OFFSET = 'a'.charCodeAt(0) - 1;

const isUpperCase = (str: string): boolean => /^[A-Z]$/.test(str);

const findCommonItemType = (rucksack: string): string | undefined => {
  const centerIndex = rucksack.length / 2;
  const compartment1Set = new Set(rucksack.slice(0, centerIndex));
  const compartment2 = rucksack.slice(centerIndex);

  return [...compartment2].find(itemType => compartment1Set.has(itemType));
};

const getPriorityOfItemType = (itemType?: string): number => {
  if (!itemType) return 0;

  if (isUpperCase(itemType)) return itemType.charCodeAt(0) - UPPERCASE_OFFSET;

  return itemType.charCodeAt(0) - LOWERCASE_OFFSET;
};

const findCommonItemTypeInGroup = (
  rucksackGroup: string[]
): string | undefined => {
  const [rucksack1, rucksack2, rucksack3] = rucksackGroup;
  const rucksack1Set = new Set(rucksack1);
  const rucksack2Set = new Set(rucksack2);

  return [...rucksack3].find(
    itemType => rucksack1Set.has(itemType) && rucksack2Set.has(itemType)
  );
};

const solveDay3 = () => {
  const rucksacks = readInputFile(2022, 3).split('\n');

  // Part 1: Sum of common items in compartments per rucksack
  const sumOfCommonItemsPerRucksack = rucksacks
    .map(findCommonItemType)
    .map(getPriorityOfItemType)
    .reduce(sumReducer);

  console.log(`Part 1: ${sumOfCommonItemsPerRucksack}`);

  // Part 2: Sum of common items in groups of rucksacks
  const groupsOfThree = getChunks(rucksacks, 3);
  const sumOfCommonItemsPerRucksackGroup = groupsOfThree
    .map(findCommonItemTypeInGroup)
    .map(getPriorityOfItemType)
    .reduce(sumReducer);

  console.log(`Part 2: ${sumOfCommonItemsPerRucksackGroup}`);
};

solveDay3();
