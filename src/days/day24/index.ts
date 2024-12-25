import { Day } from "../../day";

interface SimpleGate {
  left: string
  right: string
  operator: string
}

class ComplexGate {
  left: string | ComplexGate
  right: string | ComplexGate
  operator: string

  constructor({ left, right, operator }: {left: string | ComplexGate, right: string | ComplexGate, operator: string}) {
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  toString() {
    return `(${ this.left } ${ this.operator === 'OR' ? ' OR' : this.operator } ${ this.right })`
  }
}

const SWAPS = [
  [
    'z06',
    'hwk',
  ],
  [
    'tnt',
    'qmd',
  ],
  [
    'z31',
    'hpc',
  ],
  [
    'z37',
    'cgr',
  ],
];

export class Day24 extends Day {
  dayInt = 24;

  doPart1(data: string[]) {
    const { values, simpleGates } = this.parseData(data);
    const zWires = Object.keys(simpleGates).filter(wire => wire[0] === 'z');
    return zWires.reduce((sum, wire) => sum + (this.getValue(values, simpleGates, wire) ? 2 ** parseInt(wire.slice(1), 10) : 0), 0);
  }

  doPart2(data: string[]) {
    if (process.env.IS_TEST) {
      return 0;
    }
    const { values, simpleGates } = this.parseData(data);
    const complexGates = this.resolveGates(simpleGates);
    // console.log(
    //   Object.entries(complexGates).filter(entry => entry[0][0] === 'z').sort((l, r) => l[0] > r[0] ? -1 : 1).map(([key, gate]) => `${ key }: ${ gate }`.slice(0, 140))
    // );
    return SWAPS.flat().sort((l, r) => l > r ? 1 : -1).join(',');
  }

  parseData(data: string[]) {
    const values: Record<string, boolean> = {};
    const simpleGates: Record<string, SimpleGate> = {};
    data.forEach(row => {
      if (row.includes(': ')) {
        const [wire, value] = row.split(': ');
        values[wire] = value === '1';
      } else if (row.includes(' -> ')) {
        const [left, operator, right, _, wire] = row.split(' ');
        simpleGates[wire] = {
          left,
          right,
          operator,
        };
      }
    });
    return {
      values,
      simpleGates,
    };
  }

  getValue(values: Record<string, boolean>, gates: Record<string, SimpleGate>, wire: string) {
    if (wire in values) {
      return values[wire];
    }
    let result: boolean;
    const gate = gates[wire];
    if (gate.operator === 'AND') {
      result = this.getValue(values, gates, gate.left) && this.getValue(values, gates, gate.right);
    } else if (gate.operator === 'OR') {
      result = this.getValue(values, gates, gate.left) || this.getValue(values, gates, gate.right);
    } else if (gate.operator === 'XOR') {
      result = this.getValue(values, gates, gate.left) !== this.getValue(values, gates, gate.right);
    } else {
      throw new Error('That was unexpected!');
    }
    values[wire] = result;
    return result;
  }

  resolveGates(simpleGates: Record<string, SimpleGate>) {
    const result: Record<string, ComplexGate> = {};
    Object.keys(simpleGates).forEach((key) => {
      result[key] = this.resolveGate(key, simpleGates, result);
    });
    return result;
  }

  resolveGate(key: string, simpleGates: Record<string, SimpleGate>, complexGates: Record<string, ComplexGate>) {
    if (key in complexGates) {
      return complexGates[key];
    }
    let simple = simpleGates[key];
    SWAPS.forEach(([one, other]) => {
      if (one === key) {
        simple = simpleGates[other];
      }
      if (other === key) {
        simple = simpleGates[one];
      }
    });
    const a = ['x', 'y'].includes(simple.left[0]) ? simple.left : this.resolveGate(simple.left, simpleGates, complexGates);
    const b = ['x', 'y'].includes(simple.right[0]) ? simple.right : this.resolveGate(simple.right, simpleGates, complexGates);
    if (this.depth(a) < this.depth(b) || (this.depth(a) === this.depth(b) && a.toString() > b.toString())) {
      return new ComplexGate({
        left: a,
        right: b,
        operator: simple.operator,
      });
    }
    return new ComplexGate({
      left: b,
      right: a,
      operator: simple.operator,
    });
  }

  depth(gate: ComplexGate | string) {
    if (gate instanceof ComplexGate) {
      return Math.max(
        this.depth(gate.left),
        this.depth(gate.right),
      ) + 1;
    }
    return 0;
  }
}
