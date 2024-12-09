import { Day } from "../../day";

function isNull(value: number | null) {
  return !value && value !== 0;
}

interface Block {
  start: number
  length: number
}

export class Day09 extends Day {
  dayInt = 9;

  doPart1(data: string[]) {
    const blocks = this.parseMap1(data);
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
    let { files, free } = this.parseMap2(data);
    [...files].reverse().forEach((fileBlock) => {
      for (let freeIndex = 0; freeIndex < free.length; freeIndex++) {
        const freeBlock = free[freeIndex];
        if (freeBlock.start > fileBlock.start) {
          return;
        }
        if (freeBlock.length >= fileBlock.length) {
          fileBlock.start = freeBlock.start;
          if (freeBlock.length === fileBlock.length) {
            free = [
              ...free.slice(0, freeIndex),
              ...free.slice(freeIndex + 1),
            ];
          } else {
            free = [
              ...free.slice(0, freeIndex),
              {
                start: freeBlock.start + fileBlock.length,
                length: freeBlock.length - fileBlock.length,
              },
              ...free.slice(freeIndex + 1),
            ];
          }
          return;
        }
      }
    });
    return files.reduce((sum, fileBlock, index) => sum + index * fileBlock.length * (fileBlock.start + (fileBlock.length - 1) / 2), 0);
  }

  parseMap1(data: string[]) {
    const blocks: (number | null)[] = [];
    let id = 0;
    let isFree = false;
    [...data[0]].forEach(char => {
      const value = isFree ? null : id;
      const length = parseInt(char, 10);
      if (length > 0) {
        blocks.push(...[...Array(length).keys()].map(() => value));
      };
      if (!isFree) {
        id = id + 1;
      }
      isFree = !isFree;
    })
    return blocks;
  }

  parseMap2(data: string[]) {
    const files: Block[] = [];
    const free: Block[] = [];
    let start = 0;
    let id = 0;
    let isFree = false;
    [...data[0]].forEach(char => {
      const length = parseInt(char, 10);
      const block = {
        start,
        length,
      };
      if (isFree) {
        free.push(block);
      } else {
        files.push(block);
        id = id + 1;
      }
      isFree = !isFree;
      start = start + length;
    })
    return {
      files,
      free,
    };
  }
};
