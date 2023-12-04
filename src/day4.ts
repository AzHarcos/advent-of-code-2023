import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';

const solveDay4 = () => {
  const input = readInputFile(2023, 4).split('\n');

  let ans = 0;
  let wins: number[] = [];
  let count = 0;

  let cardNumbers = input.map((_, i) => i + 1);

  while (cardNumbers.length > 0) {
    const cardIndex = cardNumbers[0];
    const [_, nums] = input[cardIndex - 1].split(': ');
    const [winning, mine] = nums.split(' | ');

    const winNums = winning.split(' ').map(Number).filter(Boolean);
    const myNums = mine.split(' ').map(Number).filter(Boolean);

    const myWinning = myNums.filter(num => winNums.includes(num));

    if (myWinning.length) {
      wins.push(cardIndex);
      cardNumbers = [...myWinning.map((_, i) => cardIndex + i + 1), ...cardNumbers.slice(1)];
    } else {
      cardNumbers = cardNumbers.slice(1);
    }
    count++;
  }

  /*for (let line of input) {
    const [_, nums] = line.split(': ');
    const [winning, mine] = nums.split(' | ');

    const winNums = winning.split(' ').map(Number).filter(Boolean);
    const myNums = mine.split(' ').map(Number).filter(Boolean);

    const myWinning = myNums.filter(num => winNums.includes(num));

    if (myWinning.length > 0) {
      ans += 2 ** (myWinning.length - 1);
      count++;
      console.log(myWinning, ans, 2 ** 0);
    }
  }*/

  console.log(count);

  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay4();
