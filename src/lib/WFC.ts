// Wave function collapse algorithm

import { type Sprite, Texture } from "pixi.js";
import type { Textures } from "@/components/Canvas";
import { stateNames, states as statesDict } from "./generateStates";
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

    // up
    if (this.y - 1 >= 0) {
      const upCell = grid[this.pos - this.dim];
      if (!upCell.collapsed) {
        const validStates = new Set(statesDict[state].UP);
        // Set intersection of upCell.states and validStates
        upCell.states = validStates.intersection(upCell.states);
        upCell.checkNeighbors(grid);
      }
    }
    // down
    if (this.y + 1 < this.dim) {
      const downCell = grid[this.pos + this.dim];
      if (!downCell.collapsed) {
        const validStates = new Set(statesDict[state].DOWN);
        downCell.states = validStates.intersection(downCell.states);
        downCell.checkNeighbors(grid);
      }
    }
    // right
    if (this.x + 1 < this.dim) {
      const rightCell = grid[this.pos + 1];
      if (!rightCell.collapsed) {
        const validStates = new Set(statesDict[state].RIGHT);
        rightCell.states = validStates.intersection(rightCell.states);
        rightCell.checkNeighbors(grid);
      }
    }
    // left
    if (this.x - 1 >= 0) {
      const leftCell = grid[this.pos - 1];
      if (!leftCell.collapsed) {
        const validStates = new Set(statesDict[state].LEFT);
        leftCell.states = validStates.intersection(leftCell.states);
        leftCell.checkNeighbors(grid);
      }
    }
  }

  // reduce current states based on neighbors
  checkNeighbors(grid: Cell[]) {
    // up
    if (this.y - 1 >= 0) {
      const upCell = grid[this.pos - this.dim];
      const validStates = new Set();
      for (const state of upCell.states) {
        for (const validState of statesDict[state].DOWN) {
          validStates.add(validState);
        }
      }

      // Set intersection of current cell's states and valid states
      this.states = validStates.intersection(this.states);
    }
    // down
    if (this.y + 1 < this.dim) {
      const downCell = grid[this.pos + this.dim];
      const validStates = new Set();
      for (const state of downCell.states) {
        for (const validState of statesDict[state].UP) {
          validStates.add(validState);
        }
      }
      this.states = validStates.intersection(this.states);
    }
    // right
    if (this.x + 1 < this.dim) {
      const rightCell = grid[this.pos + 1];
      const validStates = new Set();
      for (const state of rightCell.states) {
        for (const validState of statesDict[state].LEFT) {
          validStates.add(validState);
        }
      }
      this.states = validStates.intersection(this.states);
    }
    // left
    if (this.x - 1 >= 0) {
      const leftCell = grid[this.pos - 1];
      const validStates = new Set();
      for (const state of leftCell.states) {
        for (const validState of statesDict[state].RIGHT) {
          validStates.add(validState);
        }
      }
      this.states = validStates.intersection(this.states);
    }
    // recalculate entropy
    this.entropy = this.states.size;
    // TODO: restart or backtrack when no possible states
  }
}
