import { Day } from "../../day";

interface Coords {
  rowIndex: number
  colIndex: number
}

class Keypad {
  keyCoords: Record<string, Coords>;

  panicCorner: Coords;

  constructor(keys: (string | null)[][]) {
    this.keyCoords = {};
    keys.forEach((row, rowIndex) => row.forEach((char, colIndex) => {
      if (char) {
        this.keyCoords[char] = {
          rowIndex,
          colIndex,
        };
      } else {
        this.panicCorner = {
          rowIndex,
          colIndex,
        };
      }
    }));
  }

  routes(fromKey: string, toKey: string) {
    const result: string[] = [];

    const fromCoords = this.keyCoords[fromKey];
    const toCoords = this.keyCoords[toKey];

    const rowKey = toCoords.rowIndex >= fromCoords.rowIndex ? 'v' : '^';
    const colKey = toCoords.colIndex >= fromCoords.colIndex ? '>' : '<';
    const rowPresses = [...Array(Math.abs(toCoords.rowIndex - fromCoords.rowIndex))].map(() => rowKey);
    const colPresses = [...Array(Math.abs(toCoords.colIndex - fromCoords.colIndex))].map(() => colKey);

    if (this.panicCorner.rowIndex !== fromCoords.rowIndex || this.panicCorner.colIndex !== toCoords.colIndex) {
      // We can go left/right first without panicking
      result.push([
        ...colPresses,
        ...rowPresses,
        'A',
      ].join(''));
    }
    if (fromCoords.rowIndex !== toCoords.rowIndex && fromCoords.colIndex !== toCoords.colIndex) {
      // It is not directly up/down or directly left/right, so there is a difference in routes
      if (this.panicCorner.rowIndex !== toCoords.rowIndex || this.panicCorner.colIndex !== fromCoords.colIndex) {
        // We can go up/down first without panicking
        result.push([
          ...rowPresses,
          ...colPresses,
          'A',
        ].join(''));
      }
    }
    return result;
  }
}

export class Day21 extends Day {
  dayInt = 21;

  doPart1(data: string[]) {
    const numberPad = new Keypad([
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      [null, '0', 'A'],
    ]);
    const directionPad = new Keypad([
      [null, '^', 'A'],
      ['<', 'v', '>'],
    ]);
    const pads = [
      numberPad,
      directionPad,
      directionPad,
    ];
    return data.reduce(
      (sum, numberSequence) => (
        sum + this.minPressesForSequence(numberSequence, pads) * parseInt(numberSequence.slice(0, 3), 10)
      ),
      0
    );
  }

  doPart2(data: string[]) {
    return 0;
  }

  minPressesForSequence(sequence: string, pads: Keypad[]) {
    let result = 0;
    let fromKey = 'A';
    [...sequence].forEach((toKey) => {
      result += this.minPressesForKeyPair(fromKey, toKey, pads);
      fromKey = toKey;
    })
    return result;
  }

  minPressesForKeyPair(fromKey: string, toKey: string, pads: Keypad[]) {
    const routes = pads[0].routes(fromKey, toKey);
    if (pads.length === 1) {
      return Math.min(...routes.map(route => route.length));
    }
    return Math.min(...routes.map(route => this.minPressesForSequence(route, pads.slice(1))));
  }
}
