import { Day } from "../../day";

class OutOfAreaError extends Error {}

class InfiniteLoopError extends Error {}

enum Outcome {
  LeftArea = 'LeftArea',
  StuckInLoop = 'StuckInloop',
}

enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

interface GuardState {
  rowIndex: number
  colIndex: number
  direction: Direction
}

class Area {
  private nRow: number;

  private nCol: number;

  guard: GuardState;

  obstacles: Record<number, number[]>;

  visited: Record<number, Record<number, Direction[]>>;

  constructor(data: string[]) {
    this.obstacles = {};
    this.visited = {};

    data.forEach((row, rowIndex) => {
      [...row].forEach((gridSquare, colIndex) => {
        if (gridSquare === '#') {
          this.addToObstacles(rowIndex, colIndex);
        } else if (gridSquare === '^') {
          this.guard = {
            rowIndex,
            colIndex,
            direction: Direction.N,
          };
          this.addToVisited();
        }
      })
    });
    this.nRow = data.length;
    this.nCol = data[0].length;
  }

  addToObstacles(rowIndex: number, colIndex: number) {
    if (!this.obstacles[rowIndex]) {
      this.obstacles[rowIndex] = [];
    }
    this.obstacles[rowIndex].push(colIndex);
  }

  private addToVisited() {
    if (!this.visited[this.guard.rowIndex]) {
      this.visited[this.guard.rowIndex] = {};
    }
    if (!this.visited[this.guard.rowIndex][this.guard.colIndex]) {
      this.visited[this.guard.rowIndex][this.guard.colIndex] = [];
    }
    if (this.visited[this.guard.rowIndex][this.guard.colIndex].includes(this.guard.direction)) {
      throw new InfiniteLoopError();
    }
    this.visited[this.guard.rowIndex][this.guard.colIndex].push(this.guard.direction);
  }

  step() {
    const next = nextLocation(this.guard);

    if (next.rowIndex < 0 || next.colIndex < 0 || next.rowIndex >= this.nRow || next.colIndex >= this.nCol) {
      throw new OutOfAreaError();
    }

    if (this.obstacles[next.rowIndex]?.includes(next.colIndex)) {
      switch (this.guard.direction) {
        case Direction.N:
          this.guard.direction = Direction.E;
          break;
        case Direction.S:
          this.guard.direction = Direction.W;
          break;
        case Direction.E:
          this.guard.direction = Direction.S;
          break;
        case Direction.W:
          this.guard.direction = Direction.N;
          break;
        default:
          throw new Error('Impossible direction!');
      }
    } else {
      this.guard.rowIndex = next.rowIndex;
      this.guard.colIndex = next.colIndex;
    }
    this.addToVisited();
  }

  nVisited() {
    return Object.values(this.visited).reduce((sum, v) => sum + Object.values(v).length, 0);
  }

  run() {
    try {
      do {
        this.step();
      } while (true)
    } catch (error) {
      if (error instanceof OutOfAreaError) {
        return Outcome.LeftArea;
      } else if (error instanceof InfiniteLoopError) {
        return Outcome.StuckInLoop;
      } else {
        throw error;
      }
    }      
}
}

function nextLocation(state: GuardState) {
  let nextRowIndex = state.rowIndex;
  let nextColIndex = state.colIndex;
  switch (state.direction) {
    case Direction.N:
      nextRowIndex = state.rowIndex - 1;
      break;
    case Direction.S:
      nextRowIndex = state.rowIndex + 1;
      break;
    case Direction.E:
      nextColIndex = state.colIndex + 1;
      break;
    case Direction.W:
      nextColIndex = state.colIndex - 1;
      break;
    default:
      throw new Error('Impossible direction!');
  }
  return {
    rowIndex: nextRowIndex,
    colIndex: nextColIndex,
  };
}

export class Day06 extends Day {
  dayInt = 6;

  doPart1(data: string[]) {
    const area = new Area(data);
    area.run();
    return area.nVisited();
  }

  doPart2(data: string[]) {
    const originalArea = new Area(data);
    const startRowIndex = originalArea.guard.rowIndex;
    const startColIndex = originalArea.guard.colIndex;
    originalArea.run();

    let goodLocations: Record<number, number[]> = {};
    Object.keys(originalArea.visited).forEach(rowIndexStr => {
      const rowIndex = parseInt(rowIndexStr, 10);
      Object.keys(originalArea.visited[rowIndex]).forEach(colIndexStr => {
        const colIndex = parseInt(colIndexStr, 10);
        if (rowIndex === startRowIndex && colIndex === startColIndex) {
          return;
        }
        const newArea = new Area(data);
        newArea.addToObstacles(rowIndex, colIndex);
        if (newArea.run() === Outcome.StuckInLoop) {
          if (!goodLocations[rowIndex]) {
            goodLocations[rowIndex] = [];
          }
          if (!goodLocations[rowIndex].includes(colIndex)) {
            goodLocations[rowIndex].push(colIndex);
          }
        }
      })
    })
    return Object.values(goodLocations).reduce((sum, l) => sum + l.length, 0);
  }
};
