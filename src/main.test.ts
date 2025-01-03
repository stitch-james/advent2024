import { readdirSync } from "fs";

import { days } from "./main";

interface TestInput {
  dayInt: number,
  part1: number | string,
  part2: number | string,
}

const testValues: TestInput[] = [
  {dayInt: 1, part1: 11, part2: 31},
  {dayInt: 2, part1: 2, part2: 4},
  {dayInt: 3, part1: 161, part2: 48},
  {dayInt: 4, part1: 18, part2: 9},
  {dayInt: 5, part1: 143, part2: 123},
  {dayInt: 6, part1: 41, part2: 6},
  {dayInt: 7, part1: 3749, part2: 11387},
  {dayInt: 8, part1: 14, part2: 34},
  {dayInt: 9, part1: 1928, part2: 2858},
  {dayInt: 10, part1: 36, part2: 81},
  {dayInt: 11, part1: 55312, part2: 65601038650482},
  {dayInt: 12, part1: 1930, part2: 1206},
  {dayInt: 13, part1: 480, part2: 875318608908},
  {dayInt: 14, part1: 12, part2: 0},
  {dayInt: 15, part1: 10092, part2: 9021},
  {dayInt: 16, part1: 7036, part2: 45},
  {dayInt: 17, part1: '4,6,3,5,6,3,5,2,1,0', part2: 117440},
  {dayInt: 18, part1: 22, part2: '6,1'},
  {dayInt: 19, part1: 6, part2: 16},
  {dayInt: 20, part1: 1, part2: 32 + 31 + 29 + 39 + 25 + 23 + 20 + 19 + 12 + 14 + 12 + 22 + 4 + 3},
  {dayInt: 21, part1: 126384, part2: 154115708116294},
  {dayInt: 22, part1: 37327623, part2: 23},
  {dayInt: 23, part1: 7, part2: 'co,de,ka,ta'},
  {dayInt: 24, part1: 2024, part2: 0},
  {dayInt: 25, part1: 3, part2: 0},
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
