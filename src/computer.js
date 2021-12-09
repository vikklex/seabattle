import {getRandom, getRandomFromArray} from './utilities';
import Game from './game';

class Computer {
  constructor(game) {
    this.game = game;
    this.hasDamagedShip = false;
  }

  isSunkShipAreaCell(x, y) {
    for (let coord of Computer.sunkShipsAreaCoords) {
      if (coord.xPos === x && coord.yPos === y) {
        return true;
      }
    }
    return false;
  }

  getCellsAround(x, y) {
    let cells = [];

    if (x - 1 >= 0) {
      cells.push({xPos: x - 1, yPos: y});
      if (y - 1 >= 0) {
        cells.push({xPos: x, yPos: y - 1});
        cells.push({xPos: x - 1, yPos: y - 1});
      }
      if (y + 1 < 10) {
        cells.push({xPos: x, yPos: y + 1});
        cells.push({xPos: x - 1, yPos: y + 1});
      }
    }

    if (x + 1 < 10) {
      cells.push({xPos: x + 1, yPos: y});
      if (y - 1 >= 0) {
        cells.push({xPos: x + 1, yPos: y - 1});
      }
      if (y + 1 < 10) {
        cells.push({xPos: x + 1, yPos: y + 1});
      }
    }

    return cells;
  }

  shoot() {
    let x = null;
    let y = null;
    let result = null;

    while (
      Game.gameOver === false &&
      result !== Game.commonData.cellType.miss
    ) {
      if (this.hasDamagedShip) {
        let randomDirection = null;
        let randomValue = null;

        if (
          Computer.damagedShipCoordsX.length > 1 &&
          Computer.damagedShipCoordsX[0] !== Computer.damagedShipCoordsX[1]
        ) {
          randomDirection = 'xDirection';
        } else if (
          Computer.damagedShipCoordsX.length > 1 &&
          Computer.damagedShipCoordsX[0] === Computer.damagedShipCoordsX[1]
        ) {
          randomDirection = 'yDirection';
        } else if (Computer.damagedShipCoordsX.length === 1) {
          randomDirection = getRandomFromArray(['xDirection', 'yDirection']);
        }

        randomValue = getRandomFromArray([-1, 1]);

        if (randomDirection === 'xDirection') {
          if (randomValue === 1) {
            let maxXpos = Math.max(...Computer.damagedShipCoordsX);
            if (maxXpos + 1 < 10) {
              x = maxXpos + 1;
              y = Computer.damagedShipCoordsY[0];
            }
          } else {
            let minXpos = Math.min(...Computer.damagedShipCoordsX);
            if (minXpos - 1 >= 0) {
              x = minXpos - 1;
              y = Computer.damagedShipCoordsY[0];
            }
          }
        } else {
          if (randomValue === 1) {
            let maxYpos = Math.max(...Computer.damagedShipCoordsY);
            if (maxYpos + 1 < 10) {
              y = maxYpos + 1;
              x = Computer.damagedShipCoordsX[0];
            }
          } else {
            let minYpos = Math.min(...Computer.damagedShipCoordsY);
            if (minYpos - 1 >= 0) {
              y = minYpos - 1;
              x = Computer.damagedShipCoordsX[0];
            }
          }
        }
      } else {
        x = getRandom(0, 9);
        y = getRandom(0, 9);
      }

      if (this.isSunkShipAreaCell(x, y)) {
        continue;
      }
      result = this.game.shoot(x, y, Game.commonData.player);

      if (result === Game.commonData.cellType.hit) {
        this.hasDamagedShip = true;
      } else if (result === Game.commonData.cellType.sunk) {
        for (let i = 0; i < Computer.damagedShipCoordsX.length; i++) {
          let cellsToPush = this.getCellsAround(
            Computer.damagedShipCoordsX[i],
            Computer.damagedShipCoordsY[i]
          );

          Computer.sunkShipsAreaCoords.push(...cellsToPush);
        }

        Computer.sunkShipsAreaCoords.push(...this.getCellsAround(x, y));
        this.hasDamagedShip = false;
        Computer.damagedShipCoordsX = [];
        Computer.damagedShipCoordsY = [];
      }
    }
  }
}

Computer.damagedShipCoordsX = [];
Computer.damagedShipCoordsY = [];
Computer.sunkShipsAreaCoords = [];

export default Computer;
