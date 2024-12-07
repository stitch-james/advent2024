import { Day } from "../../day";

interface Equation {
  value: number
  inputs: number[]
}

function couldBeTrue(equation: Equation, withConcat: boolean) {
  let possibleResults = [equation.inputs[0]];
  for (let index = 1; index < equation.inputs.length; index++) {
    const item = equation.inputs[index];
    possibleResults = possibleResults.map(r => (
      withConcat
        ? [r + item, r * item, parseInt(`${ r }${ item }`, 10)]
        : [r + item, r * item]
    )).flat();
    if (possibleResults.includes(equation.value)) {
      return true;
    }
    possibleResults = possibleResults.filter(r => r < equation.value);    
  }
  return false;
}

export class Day07 extends Day {
  dayInt = 7;

  doPart1(data: string[]) {
    const equations = this.parseData(data);
    return equations.reduce((sum, equation) => sum + (couldBeTrue(equation, false) ? equation.value : 0), 0);
  }

  doPart2(data: string[]) {
    const equations = this.parseData(data);
    return equations.reduce((sum, equation) => sum + (couldBeTrue(equation, true) ? equation.value : 0), 0);
  }

  parseData(data: string[]) {
    return data.map(row => {
      const [valueStr, inputsStr] = row.split(': ');
      const value = parseInt(valueStr, 10);
      const inputs = inputsStr.split(' ').map(s => parseInt(s, 10));
      return {
        value,
        inputs,
      };
    })
  }
};
