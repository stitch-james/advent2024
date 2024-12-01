import { days } from "./main";

interface TestInput {
  dayInt: number,
  part1: number,
  part2: number,
}

const testValues: TestInput[] = [
]

test.each(testValues)('gets correct answer from example data, day $dayInt', ({ dayInt, part1, part2 }: TestInput) => {
  const day = days[dayInt - 1];
  expect(day.part1()).toBe(part1);
  expect(day.part2()).toBe(part2);
})
