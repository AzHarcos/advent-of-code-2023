import {readInputFile} from '../util/read-input-file';

const solveDay1 = () => {
  const inputLines = readInputFile(2022, 1);
  console.log(inputLines[0]);
  console.log(inputLines[inputLines.length - 2]);
};

solveDay1();
