import {readInputFile} from '../util/read-input-file';
import {sum, sortAsc} from '../util/array-utils';

type File = {
  name: string;
  size: number;
};

type Directory = {
  path: string;
  size: number;
  parent?: Directory;
  directories: Directory[];
  files: File[];
};

const getPath = (parentDirectory: Directory, childName: string) => `${parentDirectory.path}\\${childName}`;

const changeDirectory = (targetName: string, currentDirectory?: Directory): Directory => {
  if (targetName === '..') return goToParentDirectory(currentDirectory);

  if (!currentDirectory) return createRootDirectory(targetName);

  return goToChildDirectory(currentDirectory, targetName);
};

const goToParentDirectory = (directory?: Directory): Directory => {
  if (!directory?.parent) {
    throw new Error(`No parent directory for ${directory?.path}`);
  }

  return directory.parent;
};

const goToChildDirectory = (directory: Directory, childName: string) => {
  const childPath = getPath(directory, childName);
  const childDirectory = directory.directories.find(d => d.path === childPath);

  if (!childDirectory) {
    throw new Error(`No child directory ${childName} found on ${directory.path}`);
  }

  return childDirectory;
};

const createRootDirectory = (name: string): Directory => ({
  path: name,
  size: 0,
  directories: [],
  files: [],
});

const createChildDirectory = (parent: Directory, name: string): Directory => ({
  path: getPath(parent, name),
  size: 0,
  parent,
  directories: [],
  files: [],
});

const createFile = (name: string, size: number): File => ({
  name,
  size,
});

const updateDirectorySizes = (directory: Directory, size: number) => {
  directory.size += size;

  if (directory.parent) {
    updateDirectorySizes(directory.parent, size);
  }
};

const findRootDirectory = (directory?: Directory): Directory => {
  if (!directory) throw new Error(`Can't find root directory for ${directory}`);

  if (!directory.parent) return directory;

  return findRootDirectory(directory.parent);
};

const parseFileSystem = (lines: string[]): Directory => {
  let currentDirectory: Directory | undefined = undefined;

  for (let line of lines) {
    const words = line.split(' ');
    const fileName = words[words.length - 1];

    if (line.startsWith('$ cd')) {
      currentDirectory = changeDirectory(fileName, currentDirectory);
    } else if (line.startsWith('dir')) {
      if (!currentDirectory) throw Error(`Can't add directory to directory ${currentDirectory}`);

      currentDirectory.directories.push(createChildDirectory(currentDirectory, fileName));
    } else if (!line.startsWith('$')) {
      if (!currentDirectory) throw Error(`Can't add file to directory ${currentDirectory}`);

      const fileSize = Number(words[0]);
      currentDirectory.files.push(createFile(fileName, fileSize));
      updateDirectorySizes(currentDirectory, fileSize);
    }
  }

  return findRootDirectory(currentDirectory);
};

const getDirectorySizes = (directory: Directory): Record<string, number> => {
  const childrenSizes = directory.directories.map(getDirectorySizes);
  const ownSize = {
    [directory.path]: directory.size,
  };

  return childrenSizes.reduce((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  }, ownSize);
};

const solveDay7 = () => {
  const lines = readInputFile(2022, 7).split('\n');

  const rootDirectory = parseFileSystem(lines);
  const directorySizes = Object.values(getDirectorySizes(rootDirectory));

  // Part 1: Sum of directory sizes smaller than 100000
  const MAX_SIZE = 100000;
  const sumOfDirectorySizes = sum(directorySizes.filter(size => size <= MAX_SIZE));
  console.log(`Part 1: ${sumOfDirectorySizes}`);

  // Part 2: Smallest directory with sufficient size
  const TOTAL_SPACE = 70000000;
  const NEEDED_SPACE = 30000000;
  const MAX_ALLOWED_SPACE = TOTAL_SPACE - NEEDED_SPACE;

  const usedSpace = rootDirectory.size;

  if (usedSpace < MAX_ALLOWED_SPACE) {
    console.log('Part 2: No need to delete, enough space available');
    return;
  }

  const spaceToFree = usedSpace - MAX_ALLOWED_SPACE;
  const smallestSizeToDelete = sortAsc(directorySizes.filter(size => size >= spaceToFree))[0];
  console.log(`Part 2: ${smallestSizeToDelete}`);
};

solveDay7();
