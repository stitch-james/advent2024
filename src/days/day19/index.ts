import { Day } from "../../day";

export class Day19 extends Day {
  dayInt = 19;

  doPart1(data: string[]) {
    const { available, maxLength, desiredArray } = this.parseData(data);
    return desiredArray.filter(desired => this.possible(available, maxLength, desired)).length;
  }

  doPart2(data: string[]) {
    const { available, maxLength, desiredArray } = this.parseData(data);
    const cache: Record<string, number> = {};
    return desiredArray.reduce((sum, desired) => sum + this.nPossible(available, maxLength, desired, cache), 0);
  }

  parseData(data: string[]) {
    const available = new Set(data[0].split(', '));
    const maxLength = Math.max(...[...available].map(r => r.length))
    const desiredArray = data.slice(2);

    return {
      available,
      maxLength,
      desiredArray,
    };
  }

  possible(available: Set<string>, maxLength: number, desired: string) {
    if (available.has(desired)) {
      return true;
    }
    return [...Array(maxLength).keys()].some(i => (
      available.has(desired.slice(0, i + 1))
      && this.possible(available, maxLength, desired.slice(i + 1))
    ));
  }

  nPossible(available: Set<string>, maxLength: number, desired: string, cache: Record<string, number>) {
    if (cache[desired] || cache[desired] === 0) {
      return cache[desired]
    }
    let result = 0;
    if (available.has(desired)) {
      result += 1;
    }
    [...Array(maxLength).keys()].forEach(i => {
      if (available.has(desired.slice(0, i + 1))) {
        result += this.nPossible(available, maxLength, desired.slice(i + 1), cache);
      }
    });
    cache[desired] = result;
    return result;
  }
}
