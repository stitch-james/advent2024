import { Day } from "../../day";

const MIN_SAVING = process.env.IS_TEST ? 50 : 100;
const UNKNOWN = -999;

interface Coords {
  rowIndex: number
  colIndex: number
}

export class Day20 extends Day {
  dayInt = 20;

  doPart1(data: string[]) {
    const { walls, start } = this.parseData(data);
    const timeMap = this.makeTimeMap(walls, start);
    return this.countBestCheats(timeMap, 2, MIN_SAVING);
  }

  doPart2(data: string[]) {
    const { walls, start } = this.parseData(data);
    const timeMap = this.makeTimeMap(walls, start);
    return this.countBestCheats(timeMap, 20, MIN_SAVING);
  }

  parseData(data: string[]) {
    const walls = data.map(row => [...row].map(char => char === '#'));
    const start = {
      rowIndex: data.findIndex(row => row.includes('S')),
      colIndex: data.filter(row => row.includes('S'))[0].indexOf('S'),
    };
    const end = {
      rowIndex: data.findIndex(row => row.includes('E')),
      colIndex: data.filter(row => row.includes('E'))[0].indexOf('E'),
    };
    return {
      walls,
      start,
      end,
    };
  }

  makeTimeMap(walls: boolean[][], start: Coords) {
    const timeMap = walls.map(row => row.map(() => UNKNOWN));
    timeMap[start.rowIndex][start.colIndex] = 0;
    let latest = [{
      coords: start,
      time: 0,
    }];
    while (latest.length) {
      latest = latest.map(
        ({ coords, time }) => this.surroundingSpace(coords, walls).map(
          newCoords => ({
            coords: newCoords,
            time: time + 1,
          })
        )
      ).flat().filter(
        ({ coords }) => timeMap[coords.rowIndex][coords.colIndex] === UNKNOWN
      );
      latest.forEach(({ coords, time }) => {
        timeMap[coords.rowIndex][coords.colIndex] = time;
      });
    }
    return timeMap;
  }

  surroundingSpace({ rowIndex, colIndex }: Coords, walls: boolean[][]) {
    return [
      {
        rowIndex: rowIndex - 1,
        colIndex,
      },
      {
        rowIndex: rowIndex + 1,
        colIndex,
      },
      {
        rowIndex,
        colIndex: colIndex - 1,
      },
      {
        rowIndex,
        colIndex: colIndex + 1,
      },
    ].filter(coords => (
      coords.rowIndex >= 0 && coords.rowIndex < walls.length
      && coords.colIndex >= 0 && coords.colIndex < walls[0].length
      && !walls[coords.rowIndex][coords.colIndex]
    ));
  }

  countBestCheats(timeMap: number[][], maxLength: number, minSaving: number) {
    let nBestCheats = 0;
    timeMap.forEach((startRow, startRowIndex) => startRow.forEach((startTime, startColIndex) => {
      if (startTime === UNKNOWN) {
        return;
      }
      timeMap.forEach((endRow, endRowIndex) => endRow.forEach((endTime, endColIndex) => {
        if (endTime === UNKNOWN) {
          return;
        }
        const manhattan = Math.abs(startRowIndex - endRowIndex) + Math.abs(startColIndex - endColIndex);
        if (manhattan > maxLength) {
          return;
        }
        const saving = endTime - startTime - manhattan;
        if (saving >= minSaving) {
          nBestCheats += 1;
        }
      }));
    }));
    return nBestCheats;
  }
}
