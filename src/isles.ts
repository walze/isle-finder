import { grid, gridH, gridGet, gridW, nodeColors } from "./grid";
import { range } from "./helpers";

const nIslesX = Math.min(2, Math.floor(gridW / 3));
const nIslesY = 2;

const padding = 0.2;

const width = 3;
const height = gridH * (1 / nIslesY) - gridH * padding;

const freeSpaceX = gridW - width * nIslesX;
const freeSpaceY = gridH - height * nIslesY;

const marginPerIsleX = Math.floor(freeSpaceX / nIslesX);
const marginPerIsleY = Math.floor(freeSpaceY / nIslesY);

const fullIsleX = width + marginPerIsleX;
const fullIsleY = height + marginPerIsleY;

const r = range(0, nIslesX - 1)
  .map((i) => {
    const marginX =
      i === 0 ? Math.ceil(marginPerIsleX / 2) : Math.floor(marginPerIsleX / 2);

    return i * fullIsleX + marginX;
  })
  .map((x, i) => {
    const marginY =
      i === 0 ? Math.ceil(marginPerIsleY / 2) : Math.floor(marginPerIsleY / 2);

    const get = gridGet(grid);

    range(0, nIslesY - 1).map((y) => {
      const py = y * fullIsleY + marginY;
      console.log(x, py);

      range(py, py + height - 1).map((y) => {
        const n = get([x + 1, y]);

        Object.assign(n, { isPath: false, color: nodeColors.wall });
      });

      range(x, x + width - 1).forEach((px) => {
        const n = get([px, py]);

        Object.assign(n, { isPath: false, color: nodeColors.wall });
      });
    });

    return x;
  });

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
