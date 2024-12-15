import { Day } from "../../day";

enum Content {
  ROBOT = '@',
  EMPTY = '.',
  WALL = '#',
  BOX = 'O',
  BOX_LEFT = '[',
  BOX_RIGHT = ']',
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

interface Warehouse {
  contents: Content[][]
  robot: Coords
}

class CannotMoveError extends Error {}

export class Day15 extends Day {
  dayInt = 15;

  doPart1(data: string[]) {
    let { warehouse, movements } = this.parseData(data, false);
    movements.forEach(movement => {
      try {
        warehouse = this.move(warehouse, movement);
      } catch (error) {
        if (!(error instanceof CannotMoveError)) {
          throw error;
        }
      }
    });
    return this.gpsTotal(warehouse.contents);
  }

  doPart2(data: string[]) {
    let { warehouse, movements } = this.parseData(data, true);
    movements.forEach(movement => {
      try {
        warehouse = this.move(warehouse, movement);
      } catch (error) {
        if (!(error instanceof CannotMoveError)) {
          throw error;
        }
      }
    });
    return this.gpsTotal(warehouse.contents);
  }

  parseData(data: string[], double: boolean) {
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
    const contents: Content[][] = warehouseArray.map(line => [...line].map(char => char as Content).map(content => {
      if (!double) {
        return [content];
      }
      switch (content) {
        case Content.WALL:
          return [Content.WALL, Content.WALL];
        case Content.BOX:
          return [Content.BOX_LEFT, Content.BOX_RIGHT];
        case Content.EMPTY:
          return [Content.EMPTY, Content.EMPTY];
        case Content.ROBOT:
          return [Content.ROBOT, Content.EMPTY];
        default:
          throw new Error('Nope nope!!!');
      }
    }).flat());
    const movements: Movement[] = movementsArray.map(line => [...line].map(char => char as Movement)).flat();
    const robot = {
      rowIndex: -1,
      colIndex: -1,
    };
    contents.forEach((row, rowIndex) => row.forEach((content, colIndex) => {
      if (content === Content.ROBOT) {
        robot.rowIndex = rowIndex;
        robot.colIndex = colIndex;
      }
    }))
    if (robot.rowIndex < 0 || robot.colIndex < 0) {
      throw new Error('Where is that stupid robot???');
    }
    return {
      warehouse: {
        contents,
        robot,
      },
      movements,
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

  move(warehouse: Warehouse, movement: Movement) {
    const newWarehouse = structuredClone(warehouse);
    let toMove = [{
      coords: warehouse.robot,
      content: Content.ROBOT,
    }];
    newWarehouse.contents[warehouse.robot.rowIndex][warehouse.robot.colIndex] = Content.EMPTY;
    let allEmpty: boolean;
    do {
      allEmpty = true;
      const nextToMove = [];
      const toMoveExpanded = toMove.map(({ coords, content }) => {
        const expanded = [{
          coords,
          content,
        }];
        if ([Movement.UP, Movement.DOWN].includes(movement)) {
          const nextCoords = this.moveCoords(coords, movement);
          const nextContent = newWarehouse.contents[nextCoords.rowIndex][nextCoords.colIndex];
          if (
            nextContent === Content.BOX_LEFT
            && !toMove.some(({ coords: moveCoords }) =>
              moveCoords.rowIndex === coords.rowIndex && moveCoords.colIndex === coords.colIndex + 1
            )
          ) {
            expanded.push({
              coords: this.moveCoords(coords, Movement.RIGHT),
              content: Content.EMPTY,
            });
          } else if (
            nextContent === Content.BOX_RIGHT
            && !toMove.some(({ coords: moveCoords }) =>
              moveCoords.rowIndex === coords.rowIndex && moveCoords.colIndex === coords.colIndex - 1
            )
          ) {
            expanded.push({
              coords: this.moveCoords(coords, Movement.LEFT),
              content: Content.EMPTY,
            });
          }
        }
        return expanded;
      }).flat();
      toMoveExpanded.forEach(({ coords, content }) => {
        const nextCoords = this.moveCoords(coords, movement);
        const nextContent = newWarehouse.contents[nextCoords.rowIndex][nextCoords.colIndex];
        if (nextContent === Content.WALL) {
          throw new CannotMoveError();
        }
        if ([Content.BOX, Content.BOX_LEFT, Content.BOX_RIGHT].includes(nextContent)) {
          nextToMove.push({
            coords: nextCoords,
            content: nextContent,
          });
          allEmpty = false;
        }
        newWarehouse.contents[nextCoords.rowIndex][nextCoords.colIndex] = content;
        toMove = nextToMove;
      })
    } while (!allEmpty)
    newWarehouse.robot = this.moveCoords(warehouse.robot, movement);
    return newWarehouse;
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
        littleSum + ([Content.BOX, Content.BOX_LEFT].includes(content) ? (100 * rowIndex + colIndex) : 0), 0), 0);
  }
}
