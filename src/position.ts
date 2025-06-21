export type Position = {
  row: number;
  col: number;
};

export type Direction = readonly [number, number];

export type PositionHash = `${number}:${number}`;

export function getPositionHash({ row, col }: Position): PositionHash {
  return `${row}:${col}`;
}

export function getNextPosition({ row, col }: Position, [dr, dc]: Direction): Position {
  return { row: row + dr, col: col + dc };
}

