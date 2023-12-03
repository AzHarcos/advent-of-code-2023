import {readInputFile} from '../util/read-input-file';
import {sum, sumReducer} from '../util/array-utils';

const numeralPattern = /^(one|two|three|four|five|six|seven|eight|nine)/;
const numeralToDigit = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const isDigit = (str: string): boolean => {
  return /\d/.test(str);
};

const parseDigits = (str: string): number[] => {
  return [...str].filter(isDigit).map(Number);
};

const parseDigitsIncludingNumerals = (str: string): number[] => {
  return [...str].reduce<number[]>((acc, curr, index) => {
    if (isDigit(curr)) return [...acc, Number(curr)];

    const numeralMatch = str.substring(index).match(numeralPattern);

    if (numeralMatch) return [...acc, numeralToDigit[numeralMatch[0]]];

    return acc;
  }, []);
};

const digitsToCalibrationValue = (digits: number[]): number => {
  if (digits.length === 0) return 0;

  const [firstDigit, lastDigit] = [digits[0], digits.at(-1)];

  if (!firstDigit || !lastDigit) return 0;

  return firstDigit * 10 + lastDigit;
};

const solveDay1 = () => {
  const calibrationValuesRaw = readInputFile(2023, 1).split('\n');

  // Part 1: Sum of calibration values (first and last digit of each line)
  const calibrationSumForDigits = calibrationValuesRaw
    .map(parseDigits)
    .map(digitsToCalibrationValue)
    .reduce(sumReducer);
  console.log(`Part 1: ${calibrationSumForDigits}`);

  // Part 2: Sum of calibration values (first and last digit of each line, including numerals "one"-"nine")
  const calibrationSumForDigitsAndNumerals = calibrationValuesRaw
    .map(parseDigitsIncludingNumerals)
    .map(digitsToCalibrationValue)
    .reduce(sumReducer);
  console.log(`Part 2: ${calibrationSumForDigitsAndNumerals}`);
};

solveDay1();
