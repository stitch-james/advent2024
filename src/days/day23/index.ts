import { Day } from "../../day";

export class Day23 extends Day {
  dayInt = 23;

  doPart1(data: string[]) {
    const connections = this.parseData(data);
    const threeNodeNetworksWithT: string[] = [];
    Object.entries(connections).forEach(([firstNode, connectionsOfFirstNode]) => {
      if (firstNode[0] === 't') {
        connectionsOfFirstNode.forEach(secondNode => {
          connections[secondNode].forEach(thirdNode => {
            if (connections[thirdNode].has(firstNode)) {
              const key = this.networkKey([firstNode, secondNode, thirdNode]);
              if (!threeNodeNetworksWithT.includes(key)) {
                threeNodeNetworksWithT.push(key);
              }
            }
          });
        });
      }
    });
    return threeNodeNetworksWithT.length;
  }

  doPart2(data: string[]) {
    const connections = this.parseData(data);
    const twoNodeNetworks = data.map(row => new Set(row.split('-')));
    const cache: Record<string, string> = {};
    let largestKey = '';
    twoNodeNetworks.forEach(twoNodeNetwork => {
      const key = this.growNetwork(twoNodeNetwork, connections, cache);
      if (key.length > largestKey.length) {
        largestKey = key;
      }
    });
    return largestKey;
  }

  growNetwork(network: Set<string>, connections: Record<string, Set<string>>, cache: Record<string, string>) {
    const networkArray = [...network];
    const networkKey = this.networkKey(networkArray);
    if (cache[networkKey]) {
      return cache[networkKey];
    }

    let result: string;

    const possibleNodes = networkArray.map(nodeInNetwork => connections[nodeInNetwork]).reduce((merged, candidates) => {
      const newMerged = new Set<string>();
      [...merged].forEach(node => {
        if (candidates.has(node)) {
          newMerged.add(node);
        }
      });
      return newMerged;
    });

    if (possibleNodes.size === 0) {
      result = this.networkKey(networkArray);
    } else {
      const options = [...possibleNodes].map(nextNode => this.growNetwork(new Set([
        ...network,
        nextNode,
      ]), connections, cache));
      const largestKey = Math.max(...options.map(option => option.length));
      result = options.find(option => option.length === largestKey);
    }

    cache[networkKey] = result;
    return result;
  }

  parseData(data: string[]) {
    const result: Record<string, Set<string>> = {};
    data.forEach(row => {
      const [left, right] = row.split('-');
      if (!result[left]) {
        result[left] = new Set();
      }
      if (!result[right]) {
        result[right] = new Set();
      }
      result[left].add(right);
      result[right].add(left);
    });
    return result;
  }

  networkKey(nodes: string[]) {
    return [...nodes].sort((a, b) => a > b ? 1 : (a < b ? -1 : 0)).join(',');
  }
}
