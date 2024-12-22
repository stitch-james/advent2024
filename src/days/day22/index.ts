import { Day } from "../../day";

export class Day22 extends Day {
  dayInt = 22;

  doPart1(data: string[]) {
    return data.reduce((sum, value) => {
      let binary = [...parseInt(value, 10).toString(2)].reverse().map(i => i === '1');
      [...Array(2000).keys()].forEach(() => {
        binary = this.nextSecretNumberBinary(binary);
      });
      return sum + this.binaryToInt(binary);
    }, 0);
  }

  doPart2(data: string[]) {
    const amounts: Record<string, number> = {};
    data.forEach(value => {
      const seen: string[] = [];
      let binary = [...parseInt(value, 10).toString(2)].reverse().map(i => i === '1');
      let changes: number[] = [];
      let previousOnesDigit = this.binaryToInt(binary) % 10;
      [...Array(2000).keys()].forEach(() => {
        binary = this.nextSecretNumberBinary(binary);
        const onesDigit = this.binaryToInt(binary) % 10;
        if (changes.length < 4) {
          changes = [
            ...changes,
            onesDigit - previousOnesDigit,
          ];
        } else {
          changes = [
            ...changes.slice(1),
            onesDigit - previousOnesDigit,
          ];
        }
        if (changes.length === 4) {
          const key = changes.map(d => d.toString(10)).join(',');
          if (!(seen.includes(key))) {
            seen.push(key);
            if (!amounts[key]) {
              amounts[key] = 0;
            }
            amounts[key] += onesDigit;
          }
        }
        previousOnesDigit = onesDigit;
      });
    });
    return Math.max(...Object.values(amounts));
  }

  nextSecretNumberBinary(secret: boolean[]) {
    let stepOne = [
      ...[...Array(6).keys()].map(() => false),
      ...secret,
    ];
    stepOne = this.xor(secret, stepOne);
    stepOne = stepOne.slice(0, 24);

    let stepTwo = stepOne.slice(5);
    stepTwo = this.xor(stepOne, stepTwo);
    stepTwo = stepTwo.slice(0, 24);

    let stepThree = [
      ...[...Array(11).keys()].map(() => false),
      ...stepTwo,
    ];
    stepThree = this.xor(stepTwo, stepThree);
    stepThree = stepThree.slice(0, 24);

    return stepThree;
  }

  xor(left: boolean[], right: boolean[]) {
    const lengths = [left.length, right.length];
    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);
    const leftLonger = left.length > right.length;
    return [...Array(maxLength).keys()].map((i) => i >= minLength ? (leftLonger ? left[i] : right[i]) : left[i] !== right[i]);
  }

  binaryToInt(binary: boolean[]) {
    return binary.reduce((total, bit, index) => total + (bit ? 1 : 0) * 2 ** index, 0);
  }
}
