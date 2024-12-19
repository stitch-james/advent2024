import { Day } from "../../day";

interface Registers {
  a: number
  b: number
  c: number
}

function xor(left: number, right: number) {
  const cutoff = 2**30;
  if (right > cutoff) {
    return xor(left, right % cutoff) + cutoff * xor(left, Math.floor(right / cutoff));
  }
  if (left > cutoff) {
    return xor(left % cutoff, right) + cutoff * xor(Math.floor(left / cutoff), right);
  }
  return left ^ right;
}

class Debugger {
  registers: Registers

  constructor(registers: Registers) {
    this.registers = registers;
  }

  runProgram(programStr: string) {
    const output = [];
    const program = programStr.split(',').map(n => parseInt(n, 10));
    let pointer = 0;
    while (pointer < program.length) {
      const opcode = program[pointer];
      const operand = program[pointer + 1];
      switch (opcode) {
        case 0:
          this.registers.a = this.div(operand);
          break;
        case 1:
          this.registers.b = xor(this.registers.b, operand);
          break;
        case 2:
          this.registers.b = this.combo(operand) % 8;
          break;
        case 3:
          if (this.registers.a) {
            pointer = operand - 2;
          }
          break;
        case 4:
          this.registers.b = xor(this.registers.b, this.registers.c);
          break;
        case 5:
          output.push(this.combo(operand) % 8);
        break;
        case 6:
          this.registers.b = this.div(operand);
          break;
        case 7:
          this.registers.c = this.div(operand);
          break;
        default:
          throw new Error(`Unrecognised opcode: ${ opcode }`);
        }
      pointer += 2;
    }
    return output.map(n => `${ n }`).join(',');
  }

  combo(operand: number) {
    if (operand <= 3) {
      return operand;
    }
    if (operand === 4) {
      return this.registers.a;
    }
    if (operand === 5) {
      return this.registers.b;
    }
    if (operand === 6) {
      return this.registers.c;
    }
    throw new Error(`Invalid operand for combo: ${ operand }`);
  }

  div(operand: number) {
    const comboValue = this.combo(operand);
    if (Math.log2(this.registers.a) < comboValue) {
      return 0;
    }
    return Math.floor(this.registers.a / (2 ** comboValue));
  }
}

export class Day17 extends Day {
  dayInt = 17;

  doPart1(data: string[]) {
    const registers = {
      a: parseInt(data[0].split(': ')[1], 10),
      b: parseInt(data[1].split(': ')[1], 10),
      c: parseInt(data[2].split(': ')[1], 10),
    }
    const programStr = data[4].split(': ')[1];

    const debuggerrr = new Debugger(registers);

    return debuggerrr.runProgram(programStr);
  }

  doPart2(data: string[]) {
    const programStr = data[4].split(': ')[1];
    let a = 0;
    const runningTarget = [];
    programStr.split(',').reverse().map(target => {
      runningTarget.reverse().push(target);
      runningTarget.reverse();
      a *= 8;
      while (true) {
        const debuggerrr = new Debugger({
          a,
          b: 0,
          c: 0,
        });
        const result = debuggerrr.runProgram(programStr);
        if (result === runningTarget.join(',')) {
          return;
        }
        a += 1;
      }  
    });
    return a;
  }
}
