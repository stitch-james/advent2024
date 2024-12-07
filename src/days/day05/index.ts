import { Day } from "../../day";

type RuleArrays = Record<number, number[]>;

export class Day05 extends Day {
  dayInt = 5;

  doPart1(data: string[]) {
    const { ruleArrays, updates } = this.parseData(data);
    const correct = updates.filter(update => this.isCorrectOrder(update, ruleArrays));
    return correct.reduce((sum, update) => sum + update[(update.length - 1) / 2], 0);
  }

  doPart2(data: string[]) {
    const { ruleArrays, updates } = this.parseData(data);
    const incorrect = updates.filter(update => !this.isCorrectOrder(update, ruleArrays));
    
    let result = 0;
    incorrect.forEach(originalUpdate => {
      let update = [...originalUpdate];
      let leftIndex = 0;
      do {
        let rightIndex = leftIndex + 1;
        do {
          if (ruleArrays[update[rightIndex]]?.includes(update[leftIndex])) {
            update = [
              ...update.slice(0, leftIndex),
              update[rightIndex],
              update[leftIndex],
              ...update.slice(leftIndex + 1, rightIndex),
              ...update.slice(rightIndex + 1),
            ];
            rightIndex = leftIndex + 1;
          } else {
            rightIndex = rightIndex + 1;
          }
        } while (rightIndex < originalUpdate.length)
        leftIndex = leftIndex + 1;
      } while (leftIndex < originalUpdate.length)
      
      result = result + update[(update.length - 1) / 2];
    });

    return result;
  }

  parseData(data: string[]) {
    const rules = (
      data
        .filter(row => row.includes('|'))
        .map(
          row => row.split('|').map(
            item => parseInt(item, 10)
          )
        )
    );

    const ruleArrays: RuleArrays = {};
    rules.forEach(([before, after]) => (
      ruleArrays[before]
      ? ruleArrays[before].push(after)
      : ruleArrays[before] = [after]
    ));

    const updates = (
      data
        .filter(row => row.includes(','))
        .map(
          row => row.split(',').map(
            item => parseInt(item, 10)
          )
        )
    );

    return {
      ruleArrays,
      updates,
    };
  }

  isCorrectOrder(update: number[], ruleArrays: RuleArrays) {
    return update.every(
      (page, index) => (
        index === 0
        || !ruleArrays[page]
        || update.slice(0, index).every(earlier => !ruleArrays[page].includes(earlier))
      )
    );
  }
};