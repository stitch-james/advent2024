import { Day } from "../../day";

interface Machine {
  a: {
    x: number
    y: number
  }
  b: {
    x: number
    y: number
  }
  prize: {
    x: number
    y: number
  }
}

export class Day13 extends Day {
  dayInt = 13;

  doPart1(data: string[]) {
    const machines = this.parseData(data, 0);
    return this.nTokens(machines);
  }

  doPart2(data: string[]) {
    const machines = this.parseData(data, 10000000000000);
    return this.nTokens(machines);
  }

  parseData(data: string[], offset: number) {
    const machines: Machine[] = [];
    data.forEach(line => {
      if (line.startsWith('Button A:')) {
        machines.push({
          a: {
            x: 0,
            y: 0,
          },
          b: {
            x: 0,
            y: 0,
          },
          prize: {
            x: 0,
            y: 0,
          },
        });
        const match = line.match(/Button A: X\+(\d+), Y\+(\d+)/);
        machines[machines.length - 1].a.x = parseInt(match[1], 10);
        machines[machines.length - 1].a.y = parseInt(match[2], 10);
      } else if (line.startsWith('Button B:')) {
        const match = line.match(/Button B: X\+(\d+), Y\+(\d+)/);
        machines[machines.length - 1].b.x = parseInt(match[1], 10);
        machines[machines.length - 1].b.y = parseInt(match[2], 10);
      } else if (line.startsWith('Prize:')) {
        const match = line.match(/Prize: X=(\d+), Y=(\d+)/);
        machines[machines.length - 1].prize.x = parseInt(match[1], 10) + offset;
        machines[machines.length - 1].prize.y = parseInt(match[2], 10) + offset;
      }
    });
    return machines;
  }

  nTokens(machines: Machine[]) {
    return machines.reduce((sum, { a, b, prize }) => {
      const nA = (prize.x * b.y - b.x * prize.y) / (a.x * b.y - b.x * a.y);
      const nB = (prize.x * a.y - a.x * prize.y) / (b.x * a.y - a.x * b.y);
      if (Math.round(nA) === nA && Math.round(nB) === nB) {
        return sum + 3 * nA + nB;
      }
      return sum;
    }, 0);
  }
};
