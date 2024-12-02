import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day } from "./day";

export const days: Day[] = [
  new Day01(),
  new Day02(),
];

if (require.main === module) {
  const dayInt = parseInt(process.argv[2]);
  const day = days[dayInt - 1];
  
  console.log(`Day ${dayInt}`);
  console.log(`Part 1: ${day.part1()}`);
  console.log(`Part 2: ${day.part2()}`);  
}
