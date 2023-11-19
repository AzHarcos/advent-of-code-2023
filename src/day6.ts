import {readInputFile} from '../util/read-input-file';

const findIndexOfUniqueCharacterSequence = (
  str: string,
  sequenceLength: number,
  index = 0
): number => {
  const endIndex = index + sequenceLength;
  const evaluatedCharacters = str.slice(index, endIndex);
  const uniqueCharacters = new Set(evaluatedCharacters);

  if (endIndex >= str.length) return -1;

  if (uniqueCharacters.size === sequenceLength) return endIndex;

  return findIndexOfUniqueCharacterSequence(str, sequenceLength, index + 1);
};

const solveDay6 = () => {
  const input = readInputFile(2022, 6);

  // Part 1: Index of 4 unique characters in a row
  const indexOf4UniqueCharacters = findIndexOfUniqueCharacterSequence(input, 4);
  console.log(`Part 1: ${indexOf4UniqueCharacters}`);

  // Part 2:Index of 14 unique characters in a row
  const indexOf14UniqueCharacters = findIndexOfUniqueCharacterSequence(
    input,
    14
  );
  console.log(`Part 2: ${indexOf14UniqueCharacters}`);
};

solveDay6();
