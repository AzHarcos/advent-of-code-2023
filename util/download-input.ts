import {writeFileSync} from 'fs';

const SESSION_TOKEN =
  '53616c7465645f5f6525c0e2b809838ed4788979869d7551c457176beea09d2b57e35fb2a249f6b64d3267236fa0f9d97429c208d1628738507e560453dfe738';

const downloadInput = async (
  year: number,
  day: number,
  session: string
): Promise<void> => {
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

downloadInput(2022, 1, SESSION_TOKEN);
