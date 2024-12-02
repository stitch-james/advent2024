import { Day } from "../../day";

export class Day02 extends Day {
  dayInt = 2;

  doPart1(data: string[]) {
    const reports = this.parseData(data);
    return reports.reduce((sum, report) => this.isSafe(report) ? sum + 1 : sum, 0);
  }

  doPart2(data: string[]) {
    const reports = this.parseData(data);
    return reports.reduce((sum, report) => this.isSafeWithDampener(report) ? sum + 1 : sum, 0);
  }

  private parseData(data: string[]) {
    return data.map(row => row.split(/\s+/).map(item => parseInt(item, 10)));
  }

  private isSafe(report: number[]) {
    const increasing = report[1] > report[0];
    return report.every((value, index) => (
      index === 0
      || (
        (
          (increasing && value > report[index - 1])
          || (!increasing && value < report[index - 1])
        )
        && (
          Math.abs(value - report[index - 1]) >= 1
          && Math.abs(value - report[index - 1]) <= 3
        )
      )
    ));
  }

  private isSafeWithDampener(report: number[]) {
    return (
      this.isSafe(report)
      || [...report.keys()].some(toRemove => this.isSafe(report.filter((v, index) => index !== toRemove)))
    )
  }
};