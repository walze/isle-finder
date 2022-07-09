import { Application, Graphics, Text } from "pixi.js";
import { fromEvent, map, Observable, pipe, switchMap, tap } from "rxjs";
import {
  screenW,
  screenH,
  grid,
  cellW,
  cellH,
  gridGet,
  calcPath,
  startNode,
  endNode,
  nodeColors,
} from "./grid";
import { pair } from "./helpers";
import { Node } from "./types";

import "./isles";

const ticker$ = (app: Application) =>
  new Observable<number>((subscriber) => {
    const { ticker } = app;

    ticker.deltaMS = 1000 / 24;
    ticker.maxFPS = 24;
    ticker.minFPS = 24;

    ticker.add((delta) => subscriber.next(delta));
  });

const nodeFromClick = pipe(
  map(({ offsetX, offsetY }: MouseEvent) =>
    pair(Math.floor(offsetX / cellW), Math.floor(offsetY / cellH))
  ),
  map(gridGet(grid))
);

const calcPath$ = calcPath(pair(startNode, endNode));

export const startPixi = async (view: HTMLCanvasElement) => {
  const gfx = new Graphics();
  const click$ = fromEvent<MouseEvent>(view, "click");
  const app = new Application({
    view,
    width: screenW,
    height: screenH,
    backgroundColor: 0xeeeeee,
  });

  app.stage.addChild(gfx);

  click$
    .pipe(
      nodeFromClick,
      tap(console.warn),
      tap(() =>
        grid.forEach((n) => {
          n.seen = false;
          n.f = Number.MAX_SAFE_INTEGER;
          n.g = Number.MAX_SAFE_INTEGER;
          n.h = Number.MAX_SAFE_INTEGER;
          n.parent = null;

          startNode.g = 0;
        })
      ),
      tap((n) => {
        n.color = nodeColors.wall;
        n.isPath = false;
      }),
      switchMap(() => calcPath$)
    )
    .subscribe();

  ticker$(app).subscribe((_) => {
    grid.map(drawNode(gfx));
  });

  calcPath$.subscribe();
};

const drawNode = (gfx: Graphics) => (node: Node) => {
  const { x, y, color, f, g, h, text } = node;
  gfx.beginFill(color);
  const padding = 0.5;

  const t =
    text ||
    new Text("", {
      fontSize: cellH / 3 - 1,
      fontWeight: "100",
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 1,
      lineHeight: cellH / 3 - 1,
    });

  t.text = [h, g, f]
    .map((n) => (n === Number.MAX_SAFE_INTEGER ? "" : Math.floor(n)))
    .join("\n");

  if (!text) {
    t.x = x;
    t.y = y;

    node.text = t;
    gfx.addChild(t);
  }

  gfx.drawRect(
    x + padding,
    y + padding,
    cellW - padding * 2,
    cellH - padding * 2
  );

  gfx.endFill();
};
