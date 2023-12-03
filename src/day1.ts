import {readInputFile} from '../util/read-input-file';
import {sum} from '../util/array-utils';

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

const findDigits = (str: string): number[] => {
  return [...str].filter(isDigit).map(Number);
};

const findDigitsIncludingNumerals = (str: string): number[] => {
  return [...str].reduce<number[]>((acc, curr, index) => {
    if (isDigit(curr)) return [...acc, Number(curr)];

    const numeralMatch = str.substring(index).match(numeralPattern);

    if (numeralMatch) return [...acc, numeralToDigit[numeralMatch[0]]];

    return acc;
  }, []);
};

const parseCalibrationValue =
  (includeNumerals: boolean) =>
  (calibrationValueRaw: string): number => {
    const digits = includeNumerals ? findDigitsIncludingNumerals(calibrationValueRaw) : findDigits(calibrationValueRaw);

    if (digits.length === 0) return 0;

    const [firstDigit, lastDigit] = [digits[0], digits.at(-1)];

    if (!lastDigit) throw new Error(`Did not find valid digit for calibration string ${calibrationValueRaw}`);

    return firstDigit * 10 + lastDigit;
  };

const solveDay1 = () => {
  const calibrationValuesRaw = readInputFile(2023, 1).split('\n');

  // Part 1: Sum of calibration values (first and last digit of each row)
  const calibrationValuesForDigits = calibrationValuesRaw.map(parseCalibrationValue(false));
  console.log(`Part 1: ${sum(calibrationValuesForDigits)}`);

  // Part 2: Sum of calibration values (first and last digit of each row, including numerals "one"-"nine")
  const calibrationValuesForDigitsAndNumerals = calibrationValuesRaw.map(parseCalibrationValue(true));
  console.log(`Part 2: ${sum(calibrationValuesForDigitsAndNumerals)}`);
};

solveDay1();
