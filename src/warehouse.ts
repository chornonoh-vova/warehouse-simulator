import { DIRECTIONS } from "./constants";
import { getNextPosition, getPositionHash, type Direction, type Position, type PositionHash } from "./position";

type Container = {
  left: Position;
  right: Position;
};

export class Warehouse {
  width: number;
  height: number;

  walls: Set<PositionHash>;
  boxes: Set<PositionHash>;
  containersLeft: Map<PositionHash, Container>;
  containersRight: Map<PositionHash, Container>;

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
    this.containersLeft = new Map();
    this.containersRight = new Map();

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
          case "[": {
            const right = { row, col: col + 1 };
            const rightHash = getPositionHash(right);
            const container = { left: position, right };
            this.containersLeft.set(positionHash, container);
            this.containersRight.set(rightHash, container);
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
    } else if (this.containersRight.has(nextPositionHash)) {
      const container = this.containersRight.get(nextPositionHash)!;
      if (this.canMoveContainer(container, direction)) {
        this.moveContainer(container, direction);
        this.bulldozer.position = nextPosition;
      }
    } else if (this.containersLeft.has(nextPositionHash)) {
      const container = this.containersLeft.get(nextPositionHash)!;
      if (this.canMoveContainer(container, direction)) {
        this.moveContainer(container, direction);
        this.bulldozer.position = nextPosition;
      }
    } else if (!this.walls.has(nextPositionHash)) {
      this.bulldozer.position = nextPosition;
    }
  }

  private canMoveBox(boxPosition: Position, direction: Direction): boolean {
    const nextBoxPosition = getNextPosition(boxPosition, direction);
    const nextBoxPositionHash = getPositionHash(nextBoxPosition);

    if (this.boxes.has(nextBoxPositionHash)) {
      return this.canMoveBox(nextBoxPosition, direction);
    } else {
      return !this.walls.has(nextBoxPositionHash);
    }
  }

  private moveBox(boxPosition: Position, direction: Direction) {
    const nextBoxPosition = getNextPosition(boxPosition, direction);
    const nextBoxPositionHash = getPositionHash(nextBoxPosition);

    if (this.boxes.has(nextBoxPositionHash)) {
      this.moveBox(nextBoxPosition, direction);
    }

    this.boxes.delete(getPositionHash(boxPosition));
    this.boxes.add(nextBoxPositionHash);
  }

  private canMoveContainer(container: Container, direction: Direction): boolean {
    const leftHash = getPositionHash(container.left);
    const rightHash = getPositionHash(container.right);

    const nextLeft = getNextPosition(container.left, direction);
    const nextRight = getNextPosition(container.right, direction);
    const nextLeftHash = getPositionHash(nextLeft);
    const nextRightHash = getPositionHash(nextRight);

    if (leftHash === nextRightHash) {
      if (this.containersRight.has(nextLeftHash)) {
        return this.canMoveContainer(this.containersRight.get(nextLeftHash)!, direction);
      }

      return !this.walls.has(nextLeftHash);
    } else if (rightHash === nextLeftHash) {
      if (this.containersLeft.has(nextRightHash)) {
        return this.canMoveContainer(this.containersLeft.get(nextRightHash)!, direction);
      }

      return !this.walls.has(nextRightHash);
    } else if (this.containersLeft.has(nextLeftHash)) {
      return this.canMoveContainer(this.containersLeft.get(nextLeftHash)!, direction);
    } else {
      let canMoveRight = false;

      if (this.containersLeft.has(nextRightHash)) {
        canMoveRight = this.canMoveContainer(this.containersLeft.get(nextRightHash)!, direction);
      } else {
        canMoveRight = !this.walls.has(nextRightHash);
      }

      let canMoveLeft = false;

      if (this.containersRight.has(nextLeftHash)) {
        canMoveLeft = this.canMoveContainer(this.containersRight.get(nextLeftHash)!, direction);
      } else {
        canMoveLeft = !this.walls.has(nextLeftHash);
      }

      return canMoveRight && canMoveLeft;
    }
  }

  private moveContainer(container: Container, direction: Direction) {
    const leftHash = getPositionHash(container.left);
    const rightHash = getPositionHash(container.right);

    const nextLeft = getNextPosition(container.left, direction);
    const nextRight = getNextPosition(container.right, direction);
    const nextLeftHash = getPositionHash(nextLeft);
    const nextRightHash = getPositionHash(nextRight);

    if (leftHash === nextRightHash) {
      if (this.containersRight.has(nextLeftHash)) {
        this.moveContainer(this.containersRight.get(nextLeftHash)!, direction);
      }
    } else if (rightHash === nextLeftHash) {
      if (this.containersLeft.has(nextRightHash)) {
        this.moveContainer(this.containersLeft.get(nextRightHash)!, direction);
      }
    } else if (this.containersLeft.has(nextLeftHash)) {
      this.moveContainer(this.containersLeft.get(nextLeftHash)!, direction);
    } else {
      if (this.containersLeft.has(nextRightHash)) {
        this.moveContainer(this.containersLeft.get(nextRightHash)!, direction);
      }

      if (this.containersRight.has(nextLeftHash)) {
        this.moveContainer(this.containersRight.get(nextLeftHash)!, direction);
      }
    }

    this.containersLeft.delete(leftHash);
    this.containersRight.delete(rightHash);

    this.containersLeft.set(nextLeftHash, { left: nextLeft, right: nextRight });
    this.containersRight.set(nextRightHash, { left: nextLeft, right: nextRight });
  }
}
