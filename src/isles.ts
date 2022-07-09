import { grid, gridH, gridW } from "./grid";

const padding = 0.2;
const height = gridH * 0.5 - gridH * padding;
const width = gridW * 0.5 - gridW * padding;

console.table({
  height,
  width,
  padding,
});
