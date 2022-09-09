import { Application, Graphics, Text } from 'pixi.js';
import {
  concat,
  fromEvent,
  map,
  mergeAll,
  pipe,
  tap,
} from 'rxjs';

import { applyTo } from 'ramda';
import {
  screenW,
  screenH,
  grid,
  cellW,
  cellH,
  gridGet,
} from './grid';
import { foldGrid, pair, tapLog } from './helpers';
import type { Node } from './types';

import { drawIsles } from './isles';
import { drawSlots } from './listing';

const draws = concat(drawIsles, drawSlots).pipe(foldGrid);
draws
  .pipe(
    map(applyTo(grid.value)),
    tap((g) => grid.next([...g])),
  )
  .subscribe();

const nodeFromClick = pipe(
  map(({ offsetX, offsetY }: MouseEvent) =>
    pair(
      Math.floor(offsetX / cellW),
      Math.floor(offsetY / cellH),
    ),
  ),
  map(gridGet),
  map(applyTo(grid.value)),
);

const drawNode = (gfx: Graphics) => (node: Node) => {
  const { x, y, color, f, g, h, text, px, py } = node;
  gfx.beginFill(color);
  const padding = 0.5;

  const t =
    text ||
    new Text('', {
      fontWeight: '100',
      fill: 0xeeeeee,
      stroke: 0x000000,
      strokeThickness: 1,
      fontSize: cellH / 4 - 1,
      lineHeight: cellH / 4 - 1,
      align: 'center',
    });

  t.text = `(${px} , ${py})\n${[h, g, f]
    .map(Math.round)
    .map((n, i) =>
      +n === Number.MAX_SAFE_INTEGER ? '' : `${'hgf'[i]} : ${n}`,
    )
    .join('\n')}`;

  t.x = x;
  t.y = y;

  node.text = t;

  if (!text) {
    gfx.addChild(t);
  }

  gfx.drawRect(
    x + padding,
    y + padding,
    cellW - padding * 2,
    cellH - padding * 2,
  );

  gfx.endFill();
};

const gph = new Graphics();

export const startPixi = async (view: HTMLCanvasElement) => {
  const click$ = fromEvent<MouseEvent>(view, 'click');
  const app = new Application({
    view,
    width: screenW,
    height: screenH,
    backgroundColor: 0xeeeeee,
    antialias: false,
    powerPreference: 'high-performance',
    useContextAlpha: false,
  });

  app.stage.addChild(gph);

  click$.pipe(nodeFromClick, tapLog()).subscribe();

  grid.pipe(mergeAll()).subscribe(drawNode(gph));

  // animationFrames()
  //   .pipe(
  //     throttleTime(1000 / 2),
  //     mergeMap(() => grid),
  //     mergeMap(foldGrid(draws)),
  //     mergeAll(),
  //   )
  //   .subscribe(drawNode(gph));
};
