import {readInputFile, readInputFileRaw} from '../util/read-input-file';
import {sum, mul, min, max, sortAsc, sortDsc, getChunks, sumReducer, mulReducer} from '../util/array-utils';
import {isDigit} from '../util/string-utils';
import {dir} from 'console';

type Node = {
  start: string;
  L: string;
  R: string;
};

const parseNodes = (nodesDescriptions: string[]): Record<string, Node> => {
  return nodesDescriptions.reduce((acc, nodeDescription) => {
    const node = parseNode(nodeDescription);
    return {
      ...acc,
      [node.start]: node,
    };
  }, {});
};

const parseNode = (nodeDesc: string): Node => {
  const [start, rest] = nodeDesc.split(' = ');

  const [L, R] = rest.split(', ');

  return {
    start,
    L: L.slice(1),
    R: R.slice(0, -1),
  };
};

const greatestCommonDivisor = (a, b) => (a ? greatestCommonDivisor(b % a, a) : b);

const lowestCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);

const solveDay8 = () => {
  const inputParts = readInputFile(2023, 8).split('\n\n');

  const [directions, nodesDescription] = inputParts;

  const nodesMap = parseNodes(nodesDescription.split('\n'));

  let currNode = 'AAA';

  let currNodes = Object.keys(nodesMap).filter(node => node.endsWith('A'));

  console.log(currNodes);

  const stepsArr = currNodes.map(node => {
    let steps = 0;
    let index = 0;

    let currNode = node;

    while (!currNode.endsWith('Z')) {
      const direction = directions[index];

      currNode = nodesMap[currNode][direction];

      index++;
      steps++;
      if (index === directions.length) {
        index = 0;
      }
    }

    return steps;
  });

  console.log(stepsArr.reduce(lowestCommonMultiple));
  // Part 1:
  //console.log(`Part 1: ${input}`);
};

solveDay8();
