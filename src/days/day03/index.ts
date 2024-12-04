import { Day } from "../../day";

export class Day03 extends Day {
  dayInt = 3;

  doPart1(data: string[]) {
    return (
      [...data.join('').matchAll(/mul\(\d+,\d+\)/g)]
        .map(match => this.parse(match[0]))
        .reduce((sum, value) => sum + value)
    );
  }

  doPart2(data: string[]) {
    const matches = [...data.join('').matchAll(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g)];
    let result = 0;
    let on = true;
    matches.forEach(match => {
      const command = match[0];
      if (command === 'do()') {
        on = true;
      } else if (command === 'don\'t()') {
        on = false;
      } else if (on) {
        result = result + this.parse(command);
      }
    });
    return result;
  }

  private parse(command: string) {
    const [left, right] = command.slice(4, command.length - 1).split(',').map(s => parseInt(s, 10));
    return left * right;
  }
};