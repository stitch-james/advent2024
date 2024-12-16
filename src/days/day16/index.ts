import { Day } from "../../day";

enum Facing {
  NORTH = 'north',
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
}

interface Coords {
  rowIndex: number
  colIndex: number
}

interface State {
  walls: boolean[][]
  start: Coords
  end: Coords
  pointsMap: Record<Facing, number>[][]
  latest: {
    coords: Coords
    facing: Facing
    points: number
  }[]
}

interface BackState {
  start: Coords
  end: Coords
  pointsMap: Record<Facing, number>[][]
  onRoute: Coords[]
  latest: {
    coords: Coords
    facing: Facing
    points: number
  }[]
}

const POINTS_STEP = 1;
const POINTS_TURN = 1000;
const UNKNOWN = -999;

export class Day16 extends Day {
  dayInt = 16;

  doPart1(data: string[]) {
    let state = this.parseData(data);
    while (state.latest.length) {
      state = this.step(state);
    }
    return this.minPoints(state.pointsMap, state.end);
  }

  doPart2(data: string[]) {
    let state = this.parseData(data);
    while (state.latest.length) {
      state = this.step(state);
    }
    const endPoints = this.minPoints(state.pointsMap, state.end);
    const latest = [
      Facing.NORTH,
      Facing.EAST,
      Facing.SOUTH,
      Facing.WEST,
    ].filter(
      facing => state.pointsMap[state.end.rowIndex][state.end.colIndex][facing] === endPoints
    ).map(
      facing => ({
        coords: state.end,
        facing,
        points: endPoints,
      })
    );
    let backState = {
      start: state.start,
      end: state.end,
      pointsMap: state.pointsMap,
      onRoute: [state.end],
      latest,
    };
    while (backState.latest.length) {
      backState = this.unStep(backState);
    }
    return backState.onRoute.length;
  }

  parseData(data: string[]): State {
    const walls = data.map(line => [...line].map(char => char === '#'));
    const startRow = data.findIndex(line => line.includes('S'));
    const startCol = data[startRow].indexOf('S');
    const endRow = data.findIndex(line => line.includes('E'));
    const endCol = data[endRow].indexOf('E');
    const pointsMap = data.map(line => [...line].map(() => ({
      [Facing.NORTH]: UNKNOWN,
      [Facing.EAST]: UNKNOWN,
      [Facing.SOUTH]: UNKNOWN,
      [Facing.WEST]: UNKNOWN,
    })));
    pointsMap[startRow][startCol][Facing.EAST] = 0;
    return {
      walls,
      start: {
        rowIndex: startRow,
        colIndex: startCol,
      },
      end: {
        rowIndex: endRow,
        colIndex: endCol,
      },
      pointsMap,
      latest: [{
        coords: {
          rowIndex: startRow,
          colIndex: startCol,
        },
        facing: Facing.EAST,
        points: 0,
      }],
    };
  }

  step(state: State) {
    const options = state.latest.map((current) => {
      return [
        this.turnLeft(current),
        this.turnRight(current),
        this.stepForwards(current),
      ].filter(({ coords }) => !state.walls[coords.rowIndex][coords.colIndex]);
    }).flat();
    const latest = options.filter(({ coords, facing, points }) => {
      const previous = state.pointsMap[coords.rowIndex][coords.colIndex][facing];
      return previous === UNKNOWN || points < previous;
    });
    const pointsMap = structuredClone(state.pointsMap);
    latest.forEach(({ coords, facing, points }) => {
      pointsMap[coords.rowIndex][coords.colIndex][facing] = points;
    });
    return {
      ...state,
      pointsMap,
      latest,
    };
  }

  unStep(backState: BackState) {
    const options = backState.latest.map((current) => {
      return [
        this.unTurnLeft(current),
        this.unTurnRight(current),
        this.unStepForwards(current),
      ];
    }).flat();
    const latest = options.filter(({ coords, facing, points }) => backState.pointsMap[coords.rowIndex][coords.colIndex][facing] === points);
    const onRoute = [...backState.onRoute];
    latest.forEach(({ coords }) => {
      if (!onRoute.some((c) => c.colIndex === coords.colIndex && c.rowIndex === coords.rowIndex)) {
        onRoute.push(coords);
      }
    });
    return {
      ...backState,
      onRoute,
      latest,
    };
  }

  turnLeft({ coords, facing, points }: { coords: Coords, facing: Facing, points: number }) {
    const newFacing = {
      [Facing.NORTH]: Facing.WEST,
      [Facing.EAST]: Facing.NORTH,
      [Facing.SOUTH]: Facing.EAST,
      [Facing.WEST]: Facing.SOUTH,
    }[facing];
    return {
      coords,
      facing: newFacing,
      points: points + POINTS_TURN,
    };
  }

  turnRight({ coords, facing, points }: { coords: Coords, facing: Facing, points: number }) {
    const newFacing = {
      [Facing.NORTH]: Facing.EAST,
      [Facing.EAST]: Facing.SOUTH,
      [Facing.SOUTH]: Facing.WEST,
      [Facing.WEST]: Facing.NORTH,
    }[facing];
    return {
      coords,
      facing: newFacing,
      points: points + POINTS_TURN,
    };
  }

  stepForwards({ coords, facing, points }: { coords: Coords, facing: Facing, points: number }) {
    const newCoords = {
      [Facing.NORTH]: {
        rowIndex: coords.rowIndex - 1,
        colIndex: coords.colIndex,
      },
      [Facing.EAST]: {
        rowIndex: coords.rowIndex,
        colIndex: coords.colIndex + 1,
      },
      [Facing.SOUTH]: {
        rowIndex: coords.rowIndex + 1,
        colIndex: coords.colIndex,
      },
      [Facing.WEST]: {
        rowIndex: coords.rowIndex,
        colIndex: coords.colIndex - 1,
      },
    }[facing];
    return {
      coords: newCoords,
      facing,
      points: points + POINTS_STEP,
    };
  }

  unTurnLeft({ coords, facing, points }: { coords: Coords, facing: Facing, points: number }) {
    const newFacing = {
      [Facing.NORTH]: Facing.EAST,
      [Facing.EAST]: Facing.SOUTH,
      [Facing.SOUTH]: Facing.WEST,
      [Facing.WEST]: Facing.NORTH,
    }[facing];
    return {
      coords,
      facing: newFacing,
      points: points - POINTS_TURN,
    };
  }

  unTurnRight({ coords, facing, points }: { coords: Coords, facing: Facing, points: number }) {
    const newFacing = {
      [Facing.NORTH]: Facing.WEST,
      [Facing.EAST]: Facing.NORTH,
      [Facing.SOUTH]: Facing.EAST,
      [Facing.WEST]: Facing.SOUTH,
    }[facing];
    return {
      coords,
      facing: newFacing,
      points: points - POINTS_TURN,
    };
  }

  unStepForwards({ coords, facing, points }: { coords: Coords, facing: Facing, points: number }) {
    const newCoords = {
      [Facing.NORTH]: {
        rowIndex: coords.rowIndex + 1,
        colIndex: coords.colIndex,
      },
      [Facing.EAST]: {
        rowIndex: coords.rowIndex,
        colIndex: coords.colIndex - 1,
      },
      [Facing.SOUTH]: {
        rowIndex: coords.rowIndex - 1,
        colIndex: coords.colIndex,
      },
      [Facing.WEST]: {
        rowIndex: coords.rowIndex,
        colIndex: coords.colIndex + 1,
      },
    }[facing];
    return {
      coords: newCoords,
      facing,
      points: points - POINTS_STEP,
    };
  }

  minPoints(points: Record<Facing, number>[][], coords: Coords) {
    const pointsAtCoords = Object.values(points[coords.rowIndex][coords.colIndex]);
    if (pointsAtCoords.length === 0) {
      return undefined;
    }
    return Math.min(...pointsAtCoords);
  }
}
