import { days } from "./main";

interface TestInput {
  dayInt: number,
  part1: number,
  part2: number,
}

const testValues: TestInput[] = [
  {dayInt: 1, part1: 11, part2: 31},
  {dayInt: 2, part1: 2, part2: 0},
];

test.each(testValues)('gets correct answer from example data, day $dayInt', ({ dayInt, part1, part2 }: TestInput) => {
  const day = days[dayInt - 1];
  expect(day.part1()).toBe(part1);
  expect(day.part2()).toBe(part2);
});
