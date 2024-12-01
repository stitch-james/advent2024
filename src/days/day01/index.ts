import { Day } from "../../day";

export class Day01 extends Day {
  dayInt = 1;

  doPart1(data: string[]) {
    const left: number[] = [];
    const right: number[] = [];
    data.forEach(row => {
      const [rowLeft, rowRight] = row.split(/\s+/);
      left.push(parseInt(rowLeft));
      right.push(parseInt(rowRight));
    });
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);
    return left.reduce((total, valueLeft, index) => total + Math.abs(valueLeft - right[index]), 0);
  }

  doPart2(data: string[]) {
    return 0;
  }
};