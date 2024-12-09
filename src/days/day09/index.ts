import { Day } from "../../day";

function isNull(value: number | null) {
  return !value && value !== 0;
}

export class Day09 extends Day {
  dayInt = 9;

  doPart1(data: string[]) {
    const blocks = this.parseMap(data);
    let posTo = 0;
    let posFrom = blocks.length - 1;
    while (true) {
      while (!isNull(blocks[posTo])) {
        posTo = posTo + 1;
      }
      while (isNull(blocks[posFrom])) {
        posFrom = posFrom - 1;
      }
      if (posFrom < posTo) {
        break;
      }
      blocks[posTo] = blocks[posFrom];
      blocks[posFrom] = null;
    }
    return blocks.reduce((sum, value, pos) => sum + value * pos, 0);
  }

  doPart2(data: string[]) {
    return 0;
  }

  parseMap(data: string[]) {
    const blocks: (number | null)[] = [];
    let id = 0;
    let free = false;
    [...data[0]].forEach(char => {
      const value = free ? null : id;
      const length = parseInt(char, 10);
      if (length > 0) {
        blocks.push(...[...Array(length).keys()].map(() => value));
      };
      if (!free) {
        id = id + 1;
      }
      free = !free;
    })
    return blocks;
  }
};
