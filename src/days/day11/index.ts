import { Day } from "../../day";

class StoneCounter {
  stones: Record<number, number>;

  constructor(data: string[]) {
    this.stones = {};
    data[0].split(' ').map(c => this.addStones(parseInt(c, 10), 1));
  }

  addStones(value: number, count: number) {
    if (!this.stones[value]) {
      this.stones[value] = 0;
    }
    this.stones[value] += count;
  }

  blink() {
    const previousStones = this.stones;
    this.stones = {};
    Object.entries(previousStones).map(([valueStr, count]) => {
      const value = parseInt(valueStr, 10);
      if (value === 0) {
        this.addStones(1, count);
      } else if (valueStr.length % 2 === 0) {
        this.addStones(parseInt(valueStr.slice(0, valueStr.length / 2), 10), count);
        this.addStones(parseInt(valueStr.slice(valueStr.length / 2), 10), count);
      } else {
        this.addStones(value * 2024, count);
      }
    });
  }

  nStones() {
    return Object.values(this.stones).reduce((sum, count) => sum + count);
  }
}

export class Day11 extends Day {
  dayInt = 11;

  doPart1(data: string[]) {
    const counter = new StoneCounter(data);
    [...Array(25).keys()].forEach(() => {
      counter.blink();
    })
    return counter.nStones();
  }

  doPart2(data: string[]) {
    const counter = new StoneCounter(data);
    [...Array(75).keys()].forEach(() => {
      counter.blink();
    })
    return counter.nStones();
  }
};
