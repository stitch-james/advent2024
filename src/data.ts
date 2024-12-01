import { existsSync, readFileSync } from "fs";

export function readData(dayInt: number, partInt: number): string[] {
  const prefix = process.env.DATA_FILE_PREFIX || '';
  const directory = `src/days/day${String(dayInt).padStart(2, '0')}`;
  const pathPart = `${directory}/${prefix}input-${partInt}.txt`;
  if (existsSync(pathPart)) {
    return readFileSync(pathPart, 'utf-8').trim().split('\n');
  }
  const pathDay = `${directory}/${prefix}input.txt`;
  return readFileSync(pathDay, 'utf-8').trim().split('\n');
}
