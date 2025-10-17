export interface BaseState {
  // notation 0b1010 (binary) clockwise faces from up -> right -> down -> left
  sockets: number;
}

export type LocNames = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type State = BaseState & Record<LocNames, Set<string>>;
