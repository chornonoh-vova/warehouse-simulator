import { TILE_SIZE } from "./constants";
import type { Direction } from "./position";

const wall = new Image(TILE_SIZE, TILE_SIZE);
wall.src = "/Wall.png";

export function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(wall, x, y, TILE_SIZE, TILE_SIZE);
}

const box = new Image(TILE_SIZE, TILE_SIZE);
box.src = "/Box.png";

export function drawBox(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(box, x, y, TILE_SIZE, TILE_SIZE);
}

const container = new Image(TILE_SIZE * 2, TILE_SIZE);
container.src = "/Container.png";

export function drawContainer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(container, x, y, TILE_SIZE * 2, TILE_SIZE);
}

const bulldozer = new Image(TILE_SIZE, TILE_SIZE);
bulldozer.src = "/Bulldozer.png";

export function drawBulldozer(ctx: CanvasRenderingContext2D, x: number, y: number, [dr, dc]: Direction) {
  if (dc === 0) {
    ctx.save();
    if (dr == -1) {
      ctx.translate(x + TILE_SIZE, y);
      ctx.rotate(Math.PI / 2);
    } else {
      ctx.translate(x, y + TILE_SIZE);
      ctx.rotate(-(Math.PI / 2));
    }
    ctx.drawImage(bulldozer, 0, 0, TILE_SIZE, TILE_SIZE);
    ctx.restore()
  } else {
    if (dc === 1) {
      ctx.save();
      ctx.translate(x + TILE_SIZE, y);
      ctx.scale(-1, 1);
      ctx.drawImage(bulldozer, 0, 0, TILE_SIZE, TILE_SIZE);
      ctx.restore();
    } else {
      ctx.drawImage(bulldozer, x, y, TILE_SIZE, TILE_SIZE);
    }
  }

}

await Promise.all([wall, box, container, bulldozer].map(img => {
  return new Promise((resolve) => {
    img.onload = resolve;
  });
}));
