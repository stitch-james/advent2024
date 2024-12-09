import { Day } from "../../day";

class Antinodes {
  private arrays: Record<number, number[]>;

  constructor() {
    this.arrays = {};
  }

  add({x, y}: {x: number, y: number}) {
    if (!this.arrays[x]) {
      this.arrays[x] = [];
    }
    if (!this.arrays[x].includes(y)) {
      this.arrays[x].push(y);
    }
  }

  count() {
    return Object.values(this.arrays).reduce((sum, array) => sum + array.length, 0);
  }
}

function inBounds(pos: {x: number, y: number}, nRow: number, nCol: number) {
  return pos.x >= 0 && pos.x < nCol && pos.y >= 0 && pos.y < nRow;
}

export class Day08 extends Day {
  dayInt = 8;

  doPart1(data: string[]) {
    const nRow = data.length;
    const nCol = data[0].length;
    const antennae = this.parseData(data);
    const antinodes = new Antinodes();
    Object.values(antennae).forEach(positions => {
      positions.forEach((pos0, i0) => {
        positions.slice(i0 + 1).forEach((pos1) => {
          const an0 = {
            x: pos0.x - (pos1.x - pos0.x),
            y: pos0.y - (pos1.y - pos0.y),
          };
          if (inBounds(an0, nRow, nCol)) {
            antinodes.add(an0);
          }
          const an1 = {
            x: pos1.x - (pos0.x - pos1.x),
            y: pos1.y - (pos0.y - pos1.y),
          };
          if (inBounds(an1, nRow, nCol)) {
            antinodes.add(an1);
          }
        });
      });
    });
    return antinodes.count();
  }

  doPart2(data: string[]) {
    const nRow = data.length;
    const nCol = data[0].length;
    const antennae = this.parseData(data);
    const antinodes = new Antinodes();
    Object.values(antennae).forEach(positions => {
      positions.forEach((pos0, i0) => {
        positions.slice(i0 + 1).forEach((pos1) => {
          const pos = {...pos0};
          const delta = {
            x: pos0.x - pos1.x,
            y: pos0.y - pos1.y,
          };
          do {
            pos.x = pos.x - delta.x;
            pos.y = pos.y - delta.y;
          } while (inBounds(pos, nRow, nCol))
          do {
            pos.x = pos.x + delta.x;
            pos.y = pos.y + delta.y;
            if (inBounds(pos, nRow, nCol)) {
              antinodes.add(pos);
            }
          } while (inBounds(pos, nRow, nCol))
        });
      });
    });
    return antinodes.count();
  }

  parseData(data: string[]) {
    const result: Record<string, {x: number, y: number}[]> = {};
    data.forEach((row, y) => {
      [...row].forEach((value, x) => {
        if (value !== '.') {
          if (!result[value]) {
            result[value] = [];
          }
          result[value].push({
            x,
            y,
          });
        }
      });
    });
    return result;
  }
};
