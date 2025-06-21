import { DIRECTIONS } from "./constants";
import { getNextPosition, getPositionHash, type Direction, type Position, type PositionHash } from "./position";

export class Warehouse {
  width: number;
  height: number;

  walls: Set<PositionHash>;
  boxes: Set<PositionHash>;

  bulldozer: {
    position: Position;
    direction: Direction;
  };

  constructor(map: string) {
    const tiles = map.trim()
      .split("\n")
      .filter(l => l.startsWith("#") && l.endsWith("#"))
      .map(l => l.split(""));

    this.height = tiles.length;
    this.width = tiles[0].length;

    this.walls = new Set();
    this.boxes = new Set();

    let bulldozerPosition = { row: 0, col: 0 };

    for (let row = 0; row < this.height; ++row) {
      for (let col = 0; col < this.width; ++col) {
        const tile = tiles[row][col];
        const position = { row, col };
        const positionHash = getPositionHash(position);
        switch (tile) {
          case "#": {
            this.walls.add(positionHash);
            break;
          }
          case "O": {
            this.boxes.add(positionHash);
            break;
          }
          case "@": {
            bulldozerPosition = position;
            break;
          }
        }
      }
    }

    this.bulldozer = {
      position: bulldozerPosition,
      direction: DIRECTIONS[3],
    };
  }

  moveBulldozer(direction: Direction) {
    const nextPosition = getNextPosition(this.bulldozer.position, direction);
    const nextPositionHash = getPositionHash(nextPosition);

    if (this.boxes.has(nextPositionHash)) {
      if (this.canMoveBox(nextPosition, direction)) {
        this.moveBox(nextPosition, direction);
        this.bulldozer.position = nextPosition;
      }
    } else if (!this.walls.has(nextPositionHash)) {
      this.bulldozer.position = nextPosition;
    }
  }

  canMoveBox(boxPosition: Position, direction: Direction): boolean {
    const nextBoxPosition = getNextPosition(boxPosition, direction);
    const nextBoxPositionHash = getPositionHash(nextBoxPosition);

    if (this.boxes.has(nextBoxPositionHash)) {
      return this.canMoveBox(nextBoxPosition, direction);
    } else {
      return !this.walls.has(nextBoxPositionHash);
    }
  }

  moveBox(boxPosition: Position, direction: Direction) {
    const nextBoxPosition = getNextPosition(boxPosition, direction);
    const nextBoxPositionHash = getPositionHash(nextBoxPosition);

    if (this.boxes.has(nextBoxPositionHash)) {
      this.moveBox(nextBoxPosition, direction);
    }

    this.boxes.delete(getPositionHash(boxPosition));
    this.boxes.add(nextBoxPositionHash);
  }
}
