import { Day } from "../../day";

const [WIDTH, HEIGHT] = process.env.IS_TEST ? [11, 7] : [101, 103];

interface Robot {
  p: {
    x: number
    y: number
  }
  v: {
    x: number
    y: number
  }
}

export class Day14 extends Day {
  dayInt = 14;

  doPart1(data: string[]) {
    const robots = this.parseData(data);
    this.step(robots, 100);
    return this.safetyFactor(robots);
  }

  doPart2(data: string[]) {
    if (process.env.IS_TEST) {
      return 0;
    }
    const robots = this.parseData(data);
    let nStep = 0;
    do {
      this.step(robots, 1);
      nStep += 1;
    } while (!this.isRoughlySymmetrical(robots));
    return nStep;
  }

  parseData(data: string[]) {
    return data.map(line => {
      const match = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
      return {
        p: {
          x: parseInt(match[1], 10),
          y: parseInt(match[2], 10),
        },
        v: {
          x: parseInt(match[3], 10),
          y: parseInt(match[4], 10),
        },
      };
    });
  }

  step(robots: Robot[], nSecond: number) {
    robots.forEach(robot => {
      robot.p.x = (robot.p.x + nSecond * robot.v.x) % WIDTH;
      if (robot.p.x < 0) {
        robot.p.x += WIDTH;
      }
      robot.p.y = (robot.p.y + nSecond * robot.v.y) % HEIGHT;
      if (robot.p.y < 0) {
        robot.p.y += HEIGHT;
      }
    });
  }

  safetyFactor(robots: Robot[]) {
    const count = {
      upperLeft: 0,
      upperRight: 0,
      lowerLeft: 0,
      lowerRight: 0,
    };
    robots.forEach(robot => {
      if (robot.p.x < (WIDTH / 2 - 1) && robot.p.y < (HEIGHT / 2 - 1)) {
        count.upperLeft += 1;
      } else if (robot.p.x > (WIDTH / 2) && robot.p.y < (HEIGHT / 2 - 1)) {
        count.upperRight += 1;
      } else if (robot.p.x < (WIDTH / 2 - 1) && robot.p.y > (HEIGHT / 2)) {
        count.lowerLeft += 1;
      } else if (robot.p.x > (WIDTH / 2) && robot.p.y > (HEIGHT / 2)) {
        count.lowerRight += 1;
      }
    });
    return count.upperLeft * count.upperRight * count.lowerLeft * count.lowerRight;
  }

  isRoughlySymmetrical(robots: Robot[]) {
    const threshold = 0.2;
    return (
      robots.reduce((sum, robot) => {
        return sum + (robots.some(r => r.p.x === WIDTH - 1 - robot.p.x && r.p.y === robot.p.y) ? 1 : 0);
      }, 0) / robots.length
    ) >= threshold;
  }

  display(robots: Robot[]) {
    const count = [...Array(HEIGHT).keys()].map(() => [...Array(WIDTH).keys()].map(() => 0));
    robots.forEach(robot => {
      count[robot.p.y][robot.p.x] += 1;
    });
    return count.map(row => row.map(c => `${ c }`).join(''));
  }
}
