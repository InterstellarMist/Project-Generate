// generate adjacency list from base states (includes rotations)

import type { BaseState, LocNames, State } from "@/types/tileStateTypes";
import { rotateRightBits, XNOR } from "./utils";

const baseStates: Record<string, BaseState> = {
  "0": { sockets: 0b0000 },
  "1": { sockets: 0b0101 },
  "2": { sockets: 0b1100 },
  "3": { sockets: 0b0111 },
  "4": { sockets: 0b1111 },
};

const locNames: LocNames[] = ["UP", "RIGHT", "DOWN", "LEFT"];
const bitWidth = 4;

const stateSet = new Set();
export const states: Record<string, State> = {};

// generate rotated states
for (const [key, val] of Object.entries(baseStates)) {
  // rotate state
  for (let i = 0; i < 4; i++) {
    const sockets = rotateRightBits(val.sockets, i, bitWidth);
    if (stateSet.has(sockets)) continue;

    // add unique rotation
    stateSet.add(sockets);
    states[`${key}_${i}`] = {
      sockets,
      UP: new Set(),
      RIGHT: new Set(),
      DOWN: new Set(),
      LEFT: new Set(),
    };
  }
}

// check valid adjacencies
for (const [key, val] of Object.entries(states)) {
  // check current against all states
  Object.entries(states).forEach(([testState, { sockets: testSockets }]) => {
    const result = XNOR(
      val.sockets,
      rotateRightBits(testSockets, 2, bitWidth),
      bitWidth,
    );
    const resultArray = result.toString(2).padStart(bitWidth, "0").split("");

    // push matches to states object
    resultArray.forEach((flag, index) => {
      flag === "1" && states[key][locNames[index]].add(testState);
    });
  });
}

export const oppositeLoc: Record<LocNames, LocNames> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export const stateNames = Object.keys(states).flat();
