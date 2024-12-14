import { Day } from "../../day";

interface Coords {
  rowIndex: number
  colIndex: number
}

export class Day10 extends Day {
  dayInt = 10;

  doPart1(data: string[]) {
    const topography = this.parseMap(data);
    let result = 0;
    [...Array(topography.length).keys()].forEach(rowIndex => {
      [...Array(topography[0].length).keys()].forEach(colIndex => {
        if (topography[rowIndex][colIndex] === 0) {
          let accessible = [{
            rowIndex,
            colIndex,
          }];
          [...Array(9).keys()].forEach(height => {
            accessible = this.nextHeight(topography, accessible, height, true);
          });
          result += accessible.length;
        }
      });
    });
    return result;
  }

  doPart2(data: string[]) {
    const topography = this.parseMap(data);
    let result = 0;
    [...Array(topography.length).keys()].forEach(rowIndex => {
      [...Array(topography[0].length).keys()].forEach(colIndex => {
        if (topography[rowIndex][colIndex] === 0) {
          let accessible = [{
            rowIndex,
            colIndex,
          }];
          [...Array(9).keys()].forEach(height => {
            accessible = this.nextHeight(topography, accessible, height, false);
          });
          result += accessible.length;
        }
      });
    });
    return result;
  }

  parseMap(data: string[]) {
    return data.map(row => [...row].map(char => parseInt(char, 10)));
  }

  nextHeight(topography: number[][], accessible: Coords[], height: number, unique: boolean) {
    const next = accessible.map(({ rowIndex, colIndex }) => [
      {
        rowIndex: rowIndex - 1,
        colIndex: colIndex,
      },
      {
        rowIndex: rowIndex + 1,
        colIndex: colIndex,
      },
      {
        rowIndex: rowIndex,
        colIndex: colIndex - 1,
      },
      {
        rowIndex: rowIndex,
        colIndex: colIndex + 1,
      },
    ]).flat().filter(coords => 
      coords.rowIndex >= 0
      && coords.rowIndex < topography.length
      && coords.colIndex >= 0
      && coords.colIndex < topography[0].length
      && topography[coords.rowIndex][coords.colIndex] === height + 1
    );
    if (unique) {
      const result: Coords[] = [];
      next.forEach(coords => {
        if (!result.some(c => c.colIndex === coords.colIndex && c.rowIndex === coords.rowIndex)) {
          result.push(coords);
        }
      });
      return result;
    }
    return next;
  }
};
