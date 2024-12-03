import { Day } from "../../day";

export class Day03 extends Day {
  dayInt = 3;

  doPart1(data: string[]) {
    return [...data.join('').matchAll(/mul\(\d+,\d+\)/g)].map(match => {
      const substring = match[0];
      const [left, right] = substring.slice(4, substring.length - 1).split(',').map(s => parseInt(s, 10));
      return left * right;
    }).reduce((sum, value) => sum + value);
  }

  doPart2(data: string[]) {
    return 0;
  }
};