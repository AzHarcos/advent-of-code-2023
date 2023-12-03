import {writeFileSync} from 'fs';

const SESSION_TOKEN = '';

const downloadInput = async (year: number, day: number, session: string): Promise<void> => {
  return fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: {
      Cookie: `session=${session}`,
    },
  })
    .then(async response => {
      const inputData = await response.text();
      writeToFile(inputData, year, day);
    })
    .catch(error => {
      console.log(error);
    });
};

const writeToFile = (data: string, year: number, day: number): void => {
  const fileName = `./input/${year}_${day}.txt`;
  return writeFileSync(fileName, data);
};

downloadInput(2023, 1, SESSION_TOKEN);
