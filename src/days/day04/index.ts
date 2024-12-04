import { Day } from "../../day";

export class Day04 extends Day {
  dayInt = 4;

  doPart1(data: string[]) {
    let result = 0;
    [...Array(data.length).keys()].forEach(rowIndex => {
      [...Array(data[0].length).keys()].forEach(colIndex => {
        [-1, 0, 1].forEach(rowDirection => {
          [-1, 0, 1].forEach(colDirection => {
            if (this.checkXmas(data, rowIndex, colIndex, rowDirection, colDirection)) {
              result = result + 1;
            }
          })
        })
      })
    });
    return result;
  }

  doPart2(data: string[]) {
    let result = 0;
    [...Array(data.length).keys()].forEach(rowIndex => {
      [...Array(data[0].length).keys()].forEach(colIndex => {
        if (this.checkXDashMas(data, rowIndex, colIndex)) {
          result = result + 1;
        }
      })
    });
    return result;
  }

  private checkXmas(data: string[], r: number, c: number, dr: number, dc: number) {
    if (dr === 0 && dc === 0) {
      return false;
    }
    if (r < 3 && dr === -1) {
      return false;
    }
    if (r >= data.length - 3 && dr === 1) {
      return false;
    }
    if (c < 3 && dc === -1) {
      return false;
    }
    if (c >= data[r].length - 3 && dc === 1) {
      return false;
    }
    return (
      data[r][c] === 'X'
      && data[r + dr][c + dc] === 'M'
      && data[r + 2 * dr][c + 2 * dc] === 'A'
      && data[r + 3 * dr][c + 3 * dc] === 'S'
    )
  }

  private checkXDashMas(data: string[], r: number, c: number) {
    if (r === 0) {
      return false;
    }
    if (r === data.length - 1) {
      return false;
    }
    if (c === 0) {
      return false;
    }
    if (c === data[r].length - 1) {
      return false;
    }
    return (
      data[r][c] === 'A'
      && [data[r - 1][c - 1], data[r - 1][c + 1], data[r + 1][c - 1], data[r + 1][c + 1]].sort().join('') === 'MMSS'
      && data[r - 1][c - 1] !== data[r + 1][c + 1]
    )
  }
};