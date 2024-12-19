import { Day } from "../../day";

const CONFIG = process.env.IS_TEST ? {
  nFall: 12,
  size: 7,
} : {
  nFall: 1024,
  size: 71,
};

const UNVISITED = -999;

export class Day18 extends Day {
  dayInt = 18;

  doPart1(data: string[]) {
    return this.nStep(data, CONFIG.nFall);
  }

  doPart2(data: string[]) {
    let n = CONFIG.nFall;
    while (true) {
      const result = this.nStep(data, n);
      if (result === UNVISITED) {
        return data[n - 1];
      }
      n += 1;
      if (n >= data.length) {
        throw new Error('Too easy to escape!');
      }
    }
  }

  nStep(data: string[], nCorrupted: number) {
    const corrupted = [...Array(CONFIG.size)].map(() => [...Array(CONFIG.size)].map(() => false));
    const distance = [...Array(CONFIG.size)].map(() => [...Array(CONFIG.size)].map(() => UNVISITED));
    data.slice(0, nCorrupted).forEach(line => {
      const [x, y] = line.split(',').map(i => parseInt(i, 10));
      corrupted[y][x] = true;
    });
    distance[0][0] = 0;

    let latest = [{
      x: 0,
      y: 0,
      d: 0,
    }];

    while (latest.length > 0) {
      const next = latest.map(({ x, y, d }) => ([
        {
          x: x + 1,
          y,
          d: d + 1,
        },
        {
          x: x - 1,
          y,
          d: d + 1,
        },
        {
          x,
          y: y + 1,
          d: d + 1,
        },
        {
          x,
          y: y - 1,
          d: d + 1,
        },
      ])).flat().filter(({ x, y, d }) => (
        (x >= 0 && x < CONFIG.size && y >= 0 && y < CONFIG.size)
        && !corrupted[y][x]
        && (distance[y][x] === UNVISITED || d < distance[y][x])
      ));
      latest = [];
      next.forEach(({ x, y, d }) => {
        if (!latest.some(({ x: lx, y: ly }) => x === lx && y === ly)) {
          latest.push({ x, y, d });
        }
      })
      latest.forEach(({ x, y, d }) => {
        distance[y][x] = d;
      });
    }

    return distance[CONFIG.size - 1][CONFIG.size - 1];
  }
}
