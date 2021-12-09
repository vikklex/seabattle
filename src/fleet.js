import {getRandom} from './utilities';
import Ship from './ship';
import Game from './game';

class Fleet {
  constructor(playerGrid, player) {
    this.numShips = Game.commonData.availableShips.length;
    this.playerGrid = playerGrid;
    this.player = player;
    this.fleetList = [];
    this.populate();
  }

  populate() {
    for (let i = 0; i < this.numShips; i++) {
      this.fleetList.push(
        new Ship(
          Game.commonData.availableShips[i],
          this.playerGrid,
          this.player
        )
      );
    }
  }

  placeShip(x, y, direction, shipType) {
    let shipCoords = null;

    for (let ship of this.fleetList) {
      if (shipType === ship.type && ship.isLegal(x, y, direction)) {
        ship.create(x, y, direction, false);
        shipCoords = ship.getAllShipCells();

        for (let shipCoord of shipCoords) {
          this.playerGrid.updateCell(
            shipCoord.x,
            shipCoord.y,
            'ship',
            this.player
          );
        }
        return true;
      }
    }
    return false;
  }

  placeComputerShipsRandomly() {
    let x = null;
    let y = null;
    let direction = null;
    let illegalPlacement = null;

    for (let ship of this.fleetList) {
      illegalPlacement = true;

      while (illegalPlacement) {
        x = getRandom(0, 9);
        y = getRandom(0, 9);
        direction = getRandom(0, 1);

        if (ship.isLegal(x, y, direction)) {
          ship.create(x, y, direction, false);
          illegalPlacement = false;
        } else {
          continue;
        }
      }
    }
  }

  findShipByCoords(x, y) {
    for (let ship of this.fleetList) {
      if (ship.direction === Ship.verticalDirection) {
        if (
          y === ship.yPosition &&
          x >= ship.xPosition &&
          x < ship.xPosition + ship.shipLength
        ) {
          return ship;
        } else {
          continue;
        }
      } else {
        if (
          x === ship.xPosition &&
          y >= ship.yPosition &&
          y < ship.yPosition + ship.shipLength
        ) {
          return ship;
        } else {
          continue;
        }
      }
    }
    return null;
  }

  areAllShipsSunk() {
    for (let ship of this.fleetList) {
      if (ship.sunk === false) {
        return false;
      }
    }
    return true;
  }
}

export default Fleet;
