import { drawBox, drawBulldozer, drawWall } from "./assets";
import { ALL_KEYS, DIRECTIONS, exampleMap, TILE_SIZE } from "./constants";
import { getPositionHash } from "./position";
import "./reset.css";
import "./style.css";
import { clamp } from "./utils";
import { Warehouse } from "./warehouse";

const canvas = document.getElementById("warehouse")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let uploadedMap: string | undefined;

let warehouse = new Warehouse(exampleMap);

function resize() {
  const { width, height } = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio;

  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);
}

function render() {
  const scale = window.devicePixelRatio;
  const canvasWidth = Math.floor(canvas.width / scale);
  const canvasHeight = Math.floor(canvas.height / scale);

  const warehouseWidth = warehouse.width * TILE_SIZE;
  const warehouseHeight = warehouse.height * TILE_SIZE;

  const bulldozerX = warehouse.bulldozer.position.col * 2 * TILE_SIZE;
  const bulldozerY = warehouse.bulldozer.position.row * 2 * TILE_SIZE;

  let offsetX = (canvasWidth - warehouseWidth) / 2;
  let offsetY = (canvasHeight - warehouseHeight) / 2;

  if (offsetX < 0) {
    const offsetMinX = canvasWidth - warehouseWidth;
    offsetX = clamp((canvasWidth - bulldozerX) / 2, offsetMinX, 0);
  }

  if (offsetY < 0) {
    const offsetMinY = canvasHeight - warehouseHeight;
    offsetY = clamp((canvasHeight - bulldozerY) / 2, offsetMinY, 0);
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let row = 0; row < warehouse.height; ++row) {
    for (let col = 0; col < warehouse.width; ++col) {
      const tilePositionHash = getPositionHash({ row, col });
      const x = Math.floor(offsetX + col * TILE_SIZE);
      const y = Math.floor(offsetY + row * TILE_SIZE);

      if (warehouse.walls.has(tilePositionHash)) {
        drawWall(ctx, x, y);
      } else if (warehouse.boxes.has(tilePositionHash)) {
        drawBox(ctx, x, y);
      }
    }
  }

  drawBulldozer(ctx,
    offsetX + warehouse.bulldozer.position.col * TILE_SIZE,
    offsetY + warehouse.bulldozer.position.row * TILE_SIZE,
    warehouse.bulldozer.direction,
  );

  requestAnimationFrame(render);
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!ALL_KEYS.includes(key)) {
    return;
  }

  const direction = DIRECTIONS[ALL_KEYS.indexOf(key) % 4];
  warehouse.bulldozer.direction = direction;
  warehouse.moveBulldozer(direction);
}, { passive: true })

const mapInput = document.getElementById("map")! as HTMLInputElement;

[
  document.getElementById("up"),
  document.getElementById("right"),
  document.getElementById("down"),
  document.getElementById("left")
].forEach((btn, idx) => {
  btn?.addEventListener("click", (event) => {
    event.preventDefault();
    const direction = DIRECTIONS[idx];
    warehouse.bulldozer.direction = direction;
    warehouse.moveBulldozer(direction);
  });
});

document.getElementById("upload")?.addEventListener("click", () => {
  mapInput.click();
});

mapInput.addEventListener("change", async () => {
  const file = mapInput.files?.[0];

  if (!file) {
    return;
  }

  const map = await file.text();

  uploadedMap = map;

  warehouse = new Warehouse(uploadedMap);
});

const helpDialog = document.getElementById("help-modal")! as HTMLDialogElement;

document.getElementById("help-btn")?.addEventListener("click", () => {
  helpDialog.showModal();
});

document.querySelectorAll(".close").forEach((btn) => {
  btn.addEventListener("click", () => {
    (btn.parentElement as HTMLDialogElement).close();
  });
});

document.getElementById("reset")?.addEventListener("click", () => {
  warehouse = new Warehouse(uploadedMap ?? exampleMap);
});

window.addEventListener("resize", resize);

requestAnimationFrame(() => {
  resize();
  render();
});

