import { readData } from "./data"

export abstract class Day {
  abstract dayInt: number

  abstract doPart1(data: string[]): number

  abstract doPart2(data: string[]): number

  part1() {
    return this.doPart1(readData(this.dayInt, 1));
  }

  part2() {
    return this.doPart2(readData(this.dayInt, 2));
  }
}
