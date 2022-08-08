import { Application, Graphics, Text } from 'pixi.js';
import {
  animationFrames,
  from,
  fromEvent,
  identity,
  map,
  mergeAll,
  mergeMap,
  pipe,
  tap,
  throttleTime,
} from 'rxjs';

import { applyTo, compose } from 'ramda';
import {
  screenW,
  screenH,
  grid,
  cellW,
  cellH,
  gridGet,
  calcPath,
  startNode,
} from './grid';
import { pair } from './helpers';
import type { Node } from './types';

import './listing';
import { setIsles } from './isles';

const nodeFromClick = pipe(
  map(({ offsetX, offsetY }: MouseEvent) =>
    pair(
      Math.floor(offsetX / cellW),
      Math.floor(offsetY / cellH),
    ),
  ),
  mergeMap((e) => grid.pipe(map(compose(applyTo(e), gridGet)))),
);
// grid -> gridGet(grid) -> coords -> node
const calcPath$ = calcPath(pair(startNode, startNode));

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

  click$.pipe(nodeFromClick, tap(console.warn)).subscribe();

  grid.pipe(setIsles, mergeAll()).subscribe(drawNode(gph));

  // animationFrames()
  //   .pipe(
  //     throttleTime(1000 / 3),
  //     mergeMap(() => grid),
  //     mergeMap(identity),
  //     tap((a) => console.log(a.color)),
  //   )
  //   .subscribe(drawNode(gph));
};
