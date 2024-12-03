import { readdirSync } from "fs";

import { days } from "./main";

interface TestInput {
  dayInt: number,
  part1: number,
  part2: number,
}

const testValues: TestInput[] = [
  {dayInt: 1, part1: 11, part2: 31},
  {dayInt: 2, part1: 2, part2: 4},
  {dayInt: 3, part1: 161, part2: 0},
];

test.each(testValues)('gets correct answer from example data, day $dayInt', ({ dayInt, part1, part2 }: TestInput) => {
  const day = days[dayInt - 1];
  expect(day.part1()).toBe(part1);
  expect(day.part2()).toBe(part2);
});

test('the days are sequential and labelled', () => {
  days.forEach((day, index) => expect(day.dayInt).toEqual(index + 1));
});

test('there is one test for each day', () => {
  expect(days.length).toEqual(testValues.length);
});

test('the tests are sequential and labelled', () => {
  testValues.forEach(({ dayInt }, index) => expect(dayInt).toEqual(index + 1));
});

test('each day directory is in main', () => {
  const dayDirs = readdirSync('src/days/', { withFileTypes: true }).filter(entry => entry.isDirectory());
  expect(dayDirs.length).toEqual(days.length);
});

test('each day directory has the right structure', () => {
  const dayDirs = readdirSync('src/days/', { withFileTypes: true }).filter(entry => entry.isDirectory());
  dayDirs.forEach(dayDir => {
    expect(dayDir.name.match(/day\n\n/));
    const files = readdirSync(`src/days/${ dayDir.name }/`);
    expect(files).toContain('index.ts');
    expect(files).toContain('input.txt');
  });
});
