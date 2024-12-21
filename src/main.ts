import { Day } from "./day";
import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day03 } from "./days/day03";
import { Day04 } from "./days/day04";
import { Day05 } from "./days/day05";
import { Day06 } from "./days/day06";
import { Day07 } from "./days/day07";
import { Day08 } from "./days/day08";
import { Day09 } from "./days/day09";
import { Day10 } from "./days/day10";
import { Day11 } from "./days/day11";
import { Day12 } from "./days/day12";
import { Day13 } from "./days/day13";
import { Day14 } from "./days/day14";
import { Day15 } from "./days/day15";
import { Day16 } from "./days/day16";
import { Day17 } from "./days/day17";
import { Day18 } from "./days/day18";
import { Day19 } from "./days/day19";

export const days: Day[] = [
  new Day01(),
  new Day02(),
  new Day03(),
  new Day04(),
  new Day05(),
  new Day06(),
  new Day07(),
  new Day08(),
  new Day09(),
  new Day10(),
  new Day11(),
  new Day12(),
  new Day13(),
  new Day14(),
  new Day15(),
  new Day16(),
  new Day17(),
  new Day18(),
  new Day19(),
];

if (require.main === module) {
  const dayInt = parseInt(process.argv[2]);
  const day = days[dayInt - 1];
  
  console.log(`Day ${dayInt}`);
  console.log(`Part 1: ${day.part1()}`);
  console.log(`Part 2: ${day.part2()}`);  
}
