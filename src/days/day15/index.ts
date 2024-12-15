import { Day } from "../../day";

enum Content {
  ROBOT = '@',
  EMPTY = '.',
  WALL = '#',
  BOX = 'O',
}

enum Movement {
  LEFT = '<',
  RIGHT = '>',
  UP = '^',
  DOWN = 'v',
}

interface Coords {
  rowIndex: number
  colIndex: number
}

export class Day15 extends Day {
  dayInt = 15;

  doPart1(data: string[]) {
    const { warehouse, movements, robot } = this.parseData(data);
    movements.forEach(movement => {
      if (this.canMove(warehouse, robot, movement)) {
        this.move(warehouse, robot, movement);
      }
    });
    return this.gpsTotal(warehouse);
  }

  doPart2(data: string[]) {
    return 0;
  }

  parseData(data: string[]) {
    const warehouseArray: string[] = [];
    const movementsArray: string[] = [];
    let inWarehouse = true;
    data.forEach(line => {
      if (line === '') {
        inWarehouse = false;
      } else if (inWarehouse) {
        warehouseArray.push(line);
      } else {
        movementsArray.push(line);
      }
    });
    const warehouse: Content[][] = warehouseArray.map(line => [...line].map(char => char as Content));
    const movements: Movement[] = movementsArray.map(line => [...line].map(char => char as Movement)).flat();
    const robot = {
      rowIndex: -1,
      colIndex: -1,
    };
    warehouse.forEach((row, rowIndex) => row.forEach((content, colIndex) => {
      if (content === Content.ROBOT) {
        robot.rowIndex = rowIndex;
        robot.colIndex = colIndex;
      }
    }))
    if (robot.rowIndex < 0 || robot.colIndex < 0) {
      throw new Error('Where is that stupid robot???');
    }
    return {
      warehouse,
      movements,
      robot,
    };
  }

  canMove(warehouse: Content[][], robot: Coords, movement: Movement) {
    let coords = robot;
    do {
      coords = this.moveCoords(coords, movement);
    } while (warehouse[coords.rowIndex][coords.colIndex] === Content.BOX) 
    if (warehouse[coords.rowIndex][coords.colIndex] === Content.EMPTY) {
      return true;
    }
    return false;
  }

  move(warehouse: Content[][], robot: Coords, movement: Movement) {
    let coords = robot;
    warehouse[coords.rowIndex][coords.colIndex] = Content.EMPTY;
    coords = this.moveCoords(coords, movement);
    const push = warehouse[coords.rowIndex][coords.colIndex] === Content.BOX;
    warehouse[coords.rowIndex][coords.colIndex] = Content.ROBOT;
    robot.rowIndex = coords.rowIndex;
    robot.colIndex = coords.colIndex;
    if (push) {
      do {
        coords = this.moveCoords(coords, movement);
      } while (warehouse[coords.rowIndex][coords.colIndex] === Content.BOX) 
      warehouse[coords.rowIndex][coords.colIndex] = Content.BOX;
    }
  }

  moveCoords(coords: Coords, movement: Movement) {
    switch (movement) {
      case Movement.LEFT:
        return {
          rowIndex: coords.rowIndex,
          colIndex: coords.colIndex - 1,
        };
      case Movement.RIGHT:
        return {
          rowIndex: coords.rowIndex,
          colIndex: coords.colIndex + 1,
        };
      case Movement.UP:
        return {
          rowIndex: coords.rowIndex - 1,
          colIndex: coords.colIndex,
        };
      case Movement.DOWN:
        return {
          rowIndex: coords.rowIndex + 1,
          colIndex: coords.colIndex,
        };
      default:
        throw new Error('Nope!');
    }
  }

  gpsTotal(warehouse: Content[][]) {
    return warehouse.reduce((bigSum, row, rowIndex) => 
      bigSum + row.reduce((littleSum, content, colIndex) => 
        littleSum + (content === Content.BOX ? (100 * rowIndex + colIndex) : 0), 0), 0);
  }
}
