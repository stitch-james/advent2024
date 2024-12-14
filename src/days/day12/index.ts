import { Day } from "../../day";

interface Coords {
  rowIndex: number
  colIndex: number
}

export class Day12 extends Day {
  dayInt = 12;

  doPart1(data: string[]) {
    return this.doPart(data, 1);
  }

  doPart2(data: string[]) {
    return this.doPart(data, 2);
  }

  doPart(data: string[], part: number) {
    const plotMap: (number | 'unassigned')[][] = [...Array(data.length).keys()].map(() => [...Array(data[0].length).keys()].map(() => 'unassigned'));
    let plotIndex = 0;
    let result = 0;
    data.forEach((row, rowIndex) => {
      [...row].forEach((plant, colIndex) => {
        if (plotMap[rowIndex][colIndex] !== 'unassigned') {
          return;
        }
        const inPlot = this.growPlot(
          data,
          [{
            rowIndex,
            colIndex,
          }],
          plotIndex,
          plant,
        );
        inPlot.forEach((c) => {
          plotMap[c.rowIndex][c.colIndex] = plotIndex;
        });    
        plotIndex += 1;
        if (part === 1) {
          result += this.price1(inPlot);
        } else {
          result += this.price2(inPlot);
        }
      });
    });
    return result;
  }

  growPlot(data: string[], inPlot: Coords[], plotIndex: number, plant: string): Coords[] {
    const nextWithDuplicates = inPlot.map(({ rowIndex, colIndex }) => [
      {
        rowIndex: rowIndex,
        colIndex: colIndex,
      },
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
    ]).flat().filter(({ rowIndex, colIndex }) => 
      rowIndex >= 0
      && rowIndex < data.length
      && colIndex >= 0
      && colIndex < data[0].length
      && data[rowIndex][colIndex] === plant
    );
    const next: Coords[] = [];
    nextWithDuplicates.forEach(coords => {
      if (!next.some(c => c.colIndex === coords.colIndex && c.rowIndex === coords.rowIndex)) {
        next.push(coords);
      }
    });
    if (next.length > inPlot.length) {
      return this.growPlot(data, next, plotIndex, plant);
    }
    return next;
  }

  price1(inPlot: Coords[]) {
    let perimeter = 0;
    inPlot.forEach((coords) => {
      if (!this.belowIsInPlot(coords, inPlot)) {
        perimeter += 1;
      }
      if (!this.aboveIsInPlot(coords, inPlot)) {
        perimeter += 1;
      }
      if (!this.leftIsInPlot(coords, inPlot)) {
        perimeter += 1;
      }
      if (!this.rightIsInPlot(coords, inPlot)) {
        perimeter += 1;
      }
    });
    return perimeter * inPlot.length;
  }

  price2(inPlot: Coords[]) {
    let sides = 0;
    inPlot.forEach((coords) => {
      if (!this.belowIsInPlot(coords, inPlot) && !(this.leftIsInPlot(coords, inPlot) && !this.belowLeftIsInPlot(coords, inPlot))) {
        sides += 1;
      }
      if (!this.aboveIsInPlot(coords, inPlot) && !(this.leftIsInPlot(coords, inPlot) && !this.aboveLeftIsInPlot(coords, inPlot))) {
        sides += 1;
      }
      if (!this.leftIsInPlot(coords, inPlot) && !(this.aboveIsInPlot(coords, inPlot) && !this.aboveLeftIsInPlot(coords, inPlot))) {
        sides += 1;
      }
      if (!this.rightIsInPlot(coords, inPlot) && !(this.aboveIsInPlot(coords, inPlot) && !this.aboveRightIsInPlot(coords, inPlot))) {
        sides += 1;
      }
    });
    return sides * inPlot.length;
  }

  isInPlot(rowIndex: number, colIndex: number, array: Coords[]) {
    return array.some(c => rowIndex === c.rowIndex && colIndex === c.colIndex);
  }

  belowIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex + 1, coords.colIndex, array);
  }

  aboveIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex - 1, coords.colIndex, array);
  }

  leftIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex, coords.colIndex - 1, array);
  }

  rightIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex, coords.colIndex + 1, array);
  }

  belowLeftIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex + 1, coords.colIndex - 1, array);
  }

  belowRightIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex + 1, coords.colIndex + 1, array);
  }

  aboveLeftIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex - 1, coords.colIndex - 1, array);
  }

  aboveRightIsInPlot(coords: Coords, array: Coords[]) {
    return this.isInPlot(coords.rowIndex - 1, coords.colIndex + 1, array);
  }
};
