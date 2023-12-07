import {readInputFile} from '../util/read-input-file';
import {sortDsc} from '../util/array-utils';

type HandCards = string[];
type GameCards = {
  handCards: HandCards;
  bid: number;
};

type CardRankMap = Record<string, number>;
type CardCounts = Record<string, number>;
type HandRankFunction = (handCards: HandCards) => number;

const cardRanksPart1: CardRankMap = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const cardRanksPart2: CardRankMap = {
  ...cardRanksPart1,
  J: 1,
};

const parseGameCards = (gameDescription: string): GameCards => {
  const [handCards, bid] = gameDescription.split(' ');
  return {
    handCards: handCards.split(''),
    bid: Number(bid),
  };
};

const groupedCardCounts = (handCards: HandCards): CardCounts => {
  return handCards.reduce(
    (acc, card) => ({
      ...acc,
      [card]: (acc[card] ?? 0) + 1,
    }),
    {}
  );
};

const getRankOfHandPart1 = (handCards: HandCards): number => {
  const groupedCards = groupedCardCounts(handCards);

  const cardCounts = Object.values(groupedCards);

  if (cardCounts.includes(5)) return 7;

  if (cardCounts.includes(4)) return 6;

  if (cardCounts.includes(3) && cardCounts.includes(2)) return 5;

  if (cardCounts.includes(3)) return 4;

  const numberOfPairs = cardCounts.filter(count => count === 2).length;

  if (numberOfPairs === 2) return 3;

  return numberOfPairs === 1 ? 2 : 1;
};

const getRankOfHandPart2 = (handCards: HandCards): number => {
  const groupedCards = groupedCardCounts(handCards);

  const cardCounts: number[] = Object.entries(groupedCards)
    .filter(([card]) => card !== 'J')
    .map(([_, count]) => count);

  const jokerCount = groupedCards['J'] ?? 0;
  const highestCardCount = sortDsc(cardCounts)[0] ?? 0;

  const highestCardCountIncludingJokers = highestCardCount + jokerCount;

  if (highestCardCountIncludingJokers === 5) return 7;

  if (highestCardCountIncludingJokers === 4) return 6;

  if (cardCounts.includes(3) && cardCounts.includes(2)) return 5;

  const numberOfPairs = cardCounts.filter(count => count === 2).length;

  if (numberOfPairs === 2 && jokerCount === 1) {
    return 5;
  }

  if (highestCardCountIncludingJokers === 3) return 4;

  const numberOfPairsIncludingJokers = numberOfPairs + jokerCount;

  if (numberOfPairsIncludingJokers === 2) {
    return 3;
  }

  return numberOfPairsIncludingJokers === 1 ? 2 : 1;
};

const compareHands = (
  hand1: string[],
  hand2: string[],
  rankFunction: HandRankFunction,
  cardRankMap: CardRankMap
): number => {
  const rank1 = rankFunction(hand1);
  const rank2 = rankFunction(hand2);

  if (rank1 !== rank2) return rank1 - rank2;

  for (let i = 0; i < hand1.length; i++) {
    if (hand1[i] !== hand2[i]) {
      return cardRankMap[hand1[i]] - cardRankMap[hand2[i]];
    }
  }

  return 0;
};

const getWinnings = (gameCards: GameCards[]): number => {
  return gameCards.reduce((acc, curr, index) => {
    return acc + (index + 1) * curr.bid;
  }, 0);
};

const solveDay7 = () => {
  const gameCards = readInputFile(2023, 7).split('\n').map(parseGameCards);

  const sortedHandsPart1 = [...gameCards].sort((a, b) =>
    compareHands(a.handCards, b.handCards, getRankOfHandPart1, cardRanksPart1)
  );

  const sortedHandsPart2 = [...gameCards].sort((a, b) =>
    compareHands(a.handCards, b.handCards, getRankOfHandPart2, cardRanksPart2)
  );

  // Part 1:
  console.log(`Part 1: ${getWinnings(sortedHandsPart1)}`);

  // Part 2:
  console.log(`Part 2: ${getWinnings(sortedHandsPart2)}`);
};

solveDay7();
