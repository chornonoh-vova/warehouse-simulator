const WASD = ["w", "d", "s", "a"];
const HJKL = ["k", "l", "j", "h"];
const ARROWS = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

export const ALL_KEYS = [...WASD, ...HJKL, ...ARROWS];

export const DIRECTIONS = [
  [-1, 0], // Up
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
] as const;

export const TILE_SIZE = 32;

export const exampleMap =
  "##########\n" +
  "#..O..O.O#\n" +
  "#......O.#\n" +
  "#.OO..O.O#\n" +
  "#..O@..O.#\n" +
  "#O#..O...#\n" +
  "#O..O..O.#\n" +
  "#.OO.O.OO#\n" +
  "#....O...#\n" +
  "##########\n";

