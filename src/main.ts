import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day03 } from "./days/day03";
import { Day } from "./day";
import { Day04 } from "./days/day04";
import { Day05 } from "./days/day05";
import { Day06 } from "./days/day06";

export const days: Day[] = [
  new Day01(),
  new Day02(),
  new Day03(),
  new Day04(),
  new Day05(),
  new Day06(),
];

if (require.main === module) {
  const dayInt = parseInt(process.argv[2]);
  const day = days[dayInt - 1];
  
  console.log(`Day ${dayInt}`);
  console.log(`Part 1: ${day.part1()}`);
  console.log(`Part 2: ${day.part2()}`);  
}
