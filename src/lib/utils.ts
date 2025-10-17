import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const randomPick = <T>(arr: T[] | Set<T>) => {
  if (arr instanceof Set) {
    arr = [...arr];
  }
  return arr[randomInt(arr.length)];
};

export const rotateLeftBits = (
  n: number,
  bits: number,
  bitWidth: number = 32,
) => {
  const mask = bitWidth === 32 ? 0xffffffff : ((1 << bitWidth) >>> 0) - 1;
  return ((n << bits) | (n >>> (bitWidth - bits))) & mask;
};

export const rotateRightBits = (
  n: number,
  bits: number,
  bitWidth: number = 32,
) => {
  const mask = bitWidth === 32 ? 0xffffffff : ((1 << bitWidth) >>> 0) - 1;
  return ((n >>> bits) | (n << (bitWidth - bits))) & mask;
};

export const XNOR = (a: number, b: number, bitWidth: number = 32) => {
  const mask = bitWidth === 32 ? 0xffffffff : ((1 << bitWidth) >>> 0) - 1;
  return ~(a ^ b) & mask;
};
