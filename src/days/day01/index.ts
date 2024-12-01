import { Day } from "../../day";

export class Day01 extends Day {
  dayInt = 1;

  doPart1(data: string[]) {
    const {left, right} = this.parseLists(data);
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);
    return left.reduce((total, valueLeft, index) => total + Math.abs(valueLeft - right[index]), 0);
  }

  doPart2(data: string[]) {
    const {left, right} = this.parseLists(data);
    const rightCounts = this.countEntries(right);
    return left.reduce((total, value) => total + (value * rightCounts[value] || 0), 0);
  }

  private parseLists(data: string[]) {
    const left: number[] = [];
    const right: number[] = [];
    data.forEach(row => {
      const [rowLeft, rowRight] = row.split(/\s+/);
      left.push(parseInt(rowLeft));
      right.push(parseInt(rowRight));
    });
    return {
      left,
      right,
    };
  }

  private countEntries(list: number[]) {
    const result: Record<number, number> = {};
    list.forEach(value => {
      if (result[value]) {
        result[value] = result[value] + 1;
      } else {
        result[value] = 1;
      }
    });
    return result;
  }
};