import {readInputFile} from '../util/read-input-file';
import {sum, max, sortAsc} from '../util/array-utils';

const solveDay1 = () => {
  const caloryLists = readInputFile(2022, 1).split('\n\n');

  const caloryTotals = caloryLists.map(text => sum(text.split('\n').map(Number)));

  // Part 1: Highest calory sum
  const highestCalories = max(caloryTotals);
  console.log(`Part 1: ${highestCalories}`);

  // Part 2: Sum of three highest calory total
  const sumOfThreeHighest = sum(sortAsc(caloryTotals).splice(-3));
  console.log(`Part 2: ${sumOfThreeHighest}`);
};

solveDay1();
