import { Day } from "../../day";

export class Day25 extends Day {
  dayInt = 25;

  doPart1(data: string[]) {
    const { locks, keys } = this.parseData(data);
    return locks.reduce(
      (sum, lock) => sum + keys.reduce(
        (subSum, key) => subSum + ([...Array(lock.length).keys()].every(i => lock[i] + key[i] <= 5) ? 1 : 0),
        0
      ),
      0
    );
  }

  doPart2(data: string[]) {
    return 0;
  }

  parseData(data: string[]) {
    const locks: number[][] = [];
    const keys: number[][] = [];
    let i = 0;
    while (i < data.length) {
      const itemRows = data.slice(i, i + 7);
      const item = [...Array(itemRows[0].length).keys()].map(
        j => itemRows.reduce(
          (sum, row) => sum + (row[j] === '#' ? 1 : 0),
          0
        ) - 1
      );
      if (itemRows[0] === '#####') {
        locks.push(item);
      } else {
        keys.push(item);
      }
      i += 8;
    }
    return {
      locks,
      keys,
    };
  }
}
