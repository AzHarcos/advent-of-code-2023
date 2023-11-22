import {readInputFile} from '../util/read-input-file';
import {mul} from '../util/array-utils';

type Tree = {
  row: number;
  col: number;
  height: number;
};

type TreeGrid = Tree[][];

type Direction = {
  row: -1 | 0 | 1;
  col: -1 | 0 | 1;
};

type TreeVisiblityFunction = (tree: Tree) => boolean;
type TreeScoreFunction = (tree: Tree) => number;

const directions: Direction[] = [
  {row: -1, col: 0},
  {row: 0, col: -1},
  {row: 1, col: 0},
  {row: 0, col: 1},
];

const parseGrid = (gridDescription: string): TreeGrid => {
  const lines = gridDescription.split('\n');

  return lines.reduce<TreeGrid>((treeGrid, line, rowIndex) => {
    const heights = [...line].map(Number);
    const treeRow = heights.map((height, colIndex) => createTree(rowIndex, colIndex, height));
    return [...treeGrid, treeRow];
  }, []);
};

const createTree = (row: number, col: number, height: number): Tree => ({
  row,
  col,
  height,
});

const treeToString = (tree: Tree): string => `${tree.col}/${tree.row}`;

const findVisibleTrees = (trees: Tree[], isTreeVisible: TreeVisiblityFunction): Set<Tree> => {
  const visibleTrees: Record<string, Tree> = trees.reduce((visibleTrees, tree) => {
    if (!isTreeVisible(tree)) return visibleTrees;

    return {
      ...visibleTrees,
      [treeToString(tree)]: tree,
    };
  }, {});

  return new Set(Object.values(visibleTrees));
};

const isTreeVisibleFromOutside =
  (grid: TreeGrid) =>
  (tree: Tree): boolean => {
    return directions.some(direction => isTreeVisibleFromDirection(grid, tree, direction));
  };

const isTreeVisibleFromDirection = (grid: TreeGrid, tree: Tree, direction: Direction): boolean => {
  const nextTree = grid[tree.row + direction.row]?.[tree.col + direction.col];

  if (!nextTree) return true;

  if (nextTree.height >= tree.height) return false;

  return isTreeVisibleFromDirection(grid, createTree(nextTree.row, nextTree.col, tree.height), direction);
};

const findHighestScore = (trees: Tree[], getScoreForTree: TreeScoreFunction): number => {
  return trees.reduce((acc, tree) => {
    return Math.max(acc, getScoreForTree(tree));
  }, -1);
};

const getScenicScoreForTree =
  (grid: TreeGrid) =>
  (tree: Tree): number => {
    return mul(directions.map(direction => visibleTreeCountForDirection(grid, tree, direction)));
  };

const visibleTreeCountForDirection = (grid: TreeGrid, tree: Tree, direction: Direction): number => {
  const nextTree = grid[tree.row + direction.row]?.[tree.col + direction.col];

  if (!nextTree) return 0;

  if (nextTree.height >= tree.height) return 1;

  return 1 + visibleTreeCountForDirection(grid, createTree(nextTree.row, nextTree.col, tree.height), direction);
};

const solveDay8 = () => {
  const gridDescription = readInputFile(2022, 8);

  const treeGrid = parseGrid(gridDescription);
  const trees = treeGrid.flat();

  // Part 1: Number of trees visible from the outside
  const treesVisibleFromOutside = findVisibleTrees(trees, isTreeVisibleFromOutside(treeGrid));
  console.log(`Part 1: ${treesVisibleFromOutside.size}`);

  // Part 2: Highest scenic score of all trees
  const highestScenicScore = findHighestScore(trees, getScenicScoreForTree(treeGrid));
  console.log(`Part 2: ${highestScenicScore}`);
};

solveDay8();
