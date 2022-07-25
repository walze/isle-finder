import { grid, gridH, gridGet, gridW, nodeColors } from "./grid";
import { range } from "./helpers";
import type { Node } from "./types";

const nIslesX = Math.min(4, Math.floor(gridW / 3));
const nIslesY = 2;

const padding = 0.1;

const width = 3;
const height = gridH * (1 / nIslesY) - gridH * padding;

const freeSpaceX = gridW - width * nIslesX;
const freeSpaceY = gridH - height * nIslesY;

const marginPerIsleX = Math.floor(freeSpaceX / nIslesX);
const marginPerIsleY = Math.floor(freeSpaceY / nIslesY);

const fullIsleX = width + marginPerIsleX;
const fullIsleY = height + marginPerIsleY;

const get = gridGet(grid);

const wall: Partial<Node> = { isPath: false, color: nodeColors.wall };

const xs = range(0, nIslesX - 1).map(
  (i) =>
    i * fullIsleX +
    (i === 0 ? Math.ceil(marginPerIsleX / 2) : Math.floor(marginPerIsleX / 2))
);

const ys = range(0, nIslesY - 1).map(
  (i) =>
    i * fullIsleY +
    (i === 0 ? Math.ceil(marginPerIsleY / 2) : Math.floor(marginPerIsleY / 2))
);

const r = xs.map((px) =>
  ys.map((py) => {
    range(py, py + height - 1).forEach((y) => {
      const n = get([px + 1, y]);

      Object.assign(n, wall);
    });

    range(px, px + width - 1).forEach((x) => {
      const n = get([x, py]);
      const n2 = get([x, py + height - 1]);

      Object.assign(n, wall);
      Object.assign(n2, wall);
    });
  })
);

console.table({
  height,
  width,
  freeSpaceX,
  freeSpaceY,
  marginPerIsleX,
  marginPerIsleY,
  fullIsleX,
  fullIsleY,
  r,
});
