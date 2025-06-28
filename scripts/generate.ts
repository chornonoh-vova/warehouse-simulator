import * as readline from "node:readline/promises";

import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const inputMap: string[][] = [];

rl.on('line', (line) => {
  inputMap.push(line.split(""));
});

rl.on('close', () => {
  transformMap();
});

function transformMap() {
  const boxTransforms = [
    "[]",
    "OO",
  ];

  const height = inputMap.length;
  const width = inputMap[0].length;
  let idx = 0;

  for (let row = 0; row < height; ++row) {
    let transformed = "";
    for (let col = 0; col < width; ++col) {
      switch (inputMap[row][col]) {
        case "#": {
          transformed += "##";
          break;
        }
        case ".": {
          transformed += "..";
          break;
        }
        case "O": {
          transformed += boxTransforms[idx];
          idx = (idx + 1) % boxTransforms.length;
          break;
        }
        case "@": {
          transformed += "@.";
          break;
        }
      }
    }
    console.log(transformed);
  }
}

