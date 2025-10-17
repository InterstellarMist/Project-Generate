// Wave function collapse algorithm

import { type Sprite, Texture } from "pixi.js";
import type { Textures } from "@/components/Canvas";
import type { LocNames } from "@/types/tileStateTypes";
import {
  oppositeLoc,
  stateNames,
  states as statesDict,
} from "./generateStates";
import { randomPick } from "./utils";

export const newGrid = (dim: number) => {
  return Array.from({ length: dim * dim }, () => new Cell(dim));
};

export const resetGrid = (grid: Cell[]) => {
  grid.forEach((cell) => {
    cell.reset();
  });
};

export const WFC = (grid: Cell[], textures: Textures) => {
  resetGrid(grid);
  while (true) {
    // Obtain lowest entropy cells
    const minEntropyCells = getMinEntropyCells(grid);

    // Collapse random cell with lowest entropy then propagate to neighbors
    const currCell = randomPick(minEntropyCells);
    if (!currCell) return grid;
    currCell.collapse();
    currCell.setTexture(textures);
    currCell.propagate(grid);
  }
};

export const getMinEntropyCells = (grid: Cell[]) => {
  let minEntropyCells: Cell[] = [];
  let minEntropy = Infinity;
  for (const cell of grid) {
    if (cell.collapsed) continue;
    if (cell.entropy < minEntropy) {
      minEntropy = cell.entropy;
      minEntropyCells = [cell];
    } else if (cell.entropy === minEntropy) {
      minEntropyCells.push(cell);
    }
  }
  return minEntropyCells;
};

export class Cell {
  collapsed: boolean;
  states: Set<string>;
  x: number;
  y: number;
  dim: number;
  pos: number;
  entropy: number;
  sprite: Sprite | null;

  constructor(dim: number) {
    this.pos = 0;
    this.x = 0;
    this.y = 0;
    this.dim = dim;

    this.collapsed = false;
    this.states = new Set(stateNames);
    this.entropy = stateNames.length;
    this.sprite = null;
  }

  reset() {
    this.collapsed = false;
    this.states = new Set(stateNames);
    this.entropy = stateNames.length;
    if (this.sprite) this.sprite.texture = Texture.EMPTY;
  }

  setTexture(textures: Textures) {
    if (!this.sprite) {
      console.log("Texture not set");
      return;
    }
    this.sprite.texture = textures[[...this.states][0]];
  }

  collapse() {
    this.states = new Set([randomPick(this.states)]);
    this.collapsed = true;
    this.entropy = Infinity;
  }

  propagate(grid: Cell[]) {
    const [state] = this.states;
    this.propagateToNeighbor(state, grid, "UP");
    this.propagateToNeighbor(state, grid, "DOWN");
    this.propagateToNeighbor(state, grid, "RIGHT");
    this.propagateToNeighbor(state, grid, "LEFT");
  }

  propagateToNeighbor(refState: string, grid: Cell[], loc: LocNames) {
    // use reference state (refState) to obtain valid states of neighbor
    const validStates = new Set(statesDict[refState][loc]);
    const neighbor = this.getNeighbor(grid, loc);
    if (!neighbor) return;
    if (neighbor.collapsed) return;
    // set intersection of neighbor's cell states and valid states
    neighbor.states = neighbor.states.intersection(validStates);
    neighbor.checkNeighbors(grid);
  }

  // reduce current states based on neighbors
  checkNeighbors(grid: Cell[]) {
    this.checkNeighbor(grid, "UP");
    this.checkNeighbor(grid, "DOWN");
    this.checkNeighbor(grid, "RIGHT");
    this.checkNeighbor(grid, "LEFT");
    this.entropy = this.states.size;
    // reset grid if conflict occurs
    // if (this.states.size === 0) resetGrid(grid);
  }

  checkNeighbor(grid: Cell[], loc: LocNames) {
    const validStates = new Set();
    const neighbor = this.getNeighbor(grid, loc);
    if (!neighbor) return;
    // get neighbor's valid opposite states to check with current states
    for (const state of neighbor.states) {
      for (const validState of statesDict[state][oppositeLoc[loc]]) {
        validStates.add(validState);
      }
    }
    // set intersection of current cell's states and valid states
    this.states = this.states.intersection(validStates);
  }

  getNeighbor(grid: Cell[], loc: LocNames) {
    switch (loc) {
      case "UP":
        if (this.y - 1 >= 0) {
          return grid[this.pos - this.dim];
        }
        return;
      case "DOWN":
        if (this.y + 1 < this.dim) {
          return grid[this.pos + this.dim];
        }
        return;
      case "RIGHT":
        if (this.x + 1 < this.dim) {
          return grid[this.pos + 1];
        }
        return;
      case "LEFT":
        if (this.x - 1 >= 0) {
          return grid[this.pos - 1];
        }
        return;
    }
  }
}
