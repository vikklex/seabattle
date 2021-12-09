import Game from './game';

class Ship {
  constructor(type, playerGrid, player) {
    this.damage = 0;
    this.type = type;
    this.playerGrid = playerGrid;
    this.player = player;

    switch (this.type) {
      case Game.commonData.availableShips[0]:
        this.shipLength = 4;
        break;
      case Game.commonData.availableShips[1]:
        this.shipLength = 3;
        break;
      case Game.commonData.availableShips[2]:
        this.shipLength = 3;
        break;
      case Game.commonData.availableShips[3]:
        this.shipLength = 2;
        break;
      case Game.commonData.availableShips[4]:
        this.shipLength = 2;
        break;
      case Game.commonData.availableShips[5]:
        this.shipLength = 2;
        break;
      case Game.commonData.availableShips[6]:
        this.shipLength = 1;
        break;
      case Game.commonData.availableShips[7]:
        this.shipLength = 1;
        break;
      case Game.commonData.availableShips[8]:
        this.shipLength = 1;
        break;
      case Game.commonData.availableShips[9]:
        this.shipLength = 1;
        break;
    }

    this.maxDamage = this.shipLength;
    this.sunk = false;
  }

  isLegal(x, y, direction) {
    if (this.withinBounds(x, y, direction)) {
      for (let i = 0; i < this.shipLength; i++) {
        if (direction === Ship.verticalDirection) {
          if (
            this.playerGrid.cells[x + i][y] === Game.commonData.cellType.miss ||
            this.playerGrid.cells[x + i][y] === Game.commonData.cellType.ship ||
            (y + i + 1 < 10 &&
              this.playerGrid.cells[x][y + 1] ===
                Game.commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              this.playerGrid.cells[x][y - 1] ===
                Game.commonData.cellType.ship) ||
            (x + i + 1 < 10 &&
              this.playerGrid.cells[x + i + 1][y] ===
                Game.commonData.cellType.ship) ||
            (x + i + 1 < 10 &&
              y + 1 < 10 &&
              this.playerGrid.cells[x + i + 1][y + 1] ===
                Game.commonData.cellType.ship) ||
            (x + i + 1 < 10 &&
              y - 1 >= 0 &&
              this.playerGrid.cells[x + i + 1][y - 1] ===
                Game.commonData.cellType.ship) ||
            (x + i - 1 >= 0 &&
              this.playerGrid.cells[x + i - 1][y] ===
                Game.commonData.cellType.ship) ||
            (x + i - 1 >= 0 &&
              y + 1 < 10 &&
              this.playerGrid.cells[x + i - 1][y + 1] ===
                Game.commonData.cellType.ship) ||
            (x + i - 1 >= 0 &&
              y - 1 >= 0 &&
              this.playerGrid.cells[x + i - 1][y - 1] ===
                Game.commonData.cellType.ship) ||
            this.playerGrid.cells[x + i][y] === Game.commonData.cellType.sunk
          ) {
            return false;
          }
        } else {
          if (
            this.playerGrid.cells[x][y + i] === Game.commonData.cellType.miss ||
            this.playerGrid.cells[x][y + i] === Game.commonData.cellType.ship ||
            (x + 1 < 10 &&
              this.playerGrid.cells[x + 1][y] ===
                Game.commonData.cellType.ship) ||
            (x - 1 >= 0 &&
              this.playerGrid.cells[x - 1][y] ===
                Game.commonData.cellType.ship) ||
            (y + i + 1 < 10 &&
              this.playerGrid.cells[x][y + i + 1] ===
                Game.commonData.cellType.ship) ||
            (y + i + 1 < 10 &&
              x + 1 < 10 &&
              this.playerGrid.cells[x + 1][y + i + 1] ===
                Game.commonData.cellType.ship) ||
            (y + i + 1 < 10 &&
              x - 1 >= 0 &&
              this.playerGrid.cells[x - 1][y + i + 1] ===
                Game.commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              this.playerGrid.cells[x][y + i - 1] ===
                Game.commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              x + 1 < 10 &&
              this.playerGrid.cells[x + 1][y + i - 1] ===
                Game.commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              x - 1 >= 0 &&
              this.playerGrid.cells[x - 1][y + i - 1] ===
                Game.commonData.cellType.ship) ||
            this.playerGrid.cells[x][y + i] === Game.commonData.cellType.sunk
          ) {
            return false;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }

  withinBounds(x, y, direction) {
    if (direction === Ship.verticalDirection) {
      return x + this.shipLength <= 10;
    } else {
      return y + this.shipLength <= 10;
    }
  }

  getAllShipCells() {
    let resultObject = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (this.direction === Ship.verticalDirection) {
        resultObject[i] = {x: this.xPosition + i, y: this.yPosition};
      } else {
        resultObject[i] = {x: this.xPosition, y: this.yPosition + i};
      }
    }
    return resultObject;
  }

  create(x, y, direction, temporary) {
    this.xPosition = x;
    this.yPosition = y;
    this.direction = direction;

    if (!temporary) {
      for (var i = 0; i < this.shipLength; i++) {
        if (this.direction === Ship.verticalDirection) {
          this.playerGrid.cells[x + i][y] = Game.commonData.cellType.ship;
        } else {
          this.playerGrid.cells[x][y + i] = Game.commonData.cellType.ship;
        }
      }
    }
  }

  isSunk() {
    return this.damage >= this.maxDamage;
  }

  sinkShip() {
    this.damage = this.maxDamage;
    this.sunk = true;

    var allCells = this.getAllShipCells();

    for (var i = 0; i < this.shipLength; i++) {
      this.playerGrid.updateCell(
        allCells[i].x,
        allCells[i].y,
        'sunk',
        this.player
      );
    }
  }

  incrementDamage() {
    this.damage++;

    if (this.isSunk()) {
      this.sinkShip();
      return Game.commonData.cellType.sunk;
    }

    return Game.commonData.cellType.hit;
  }
}

Ship.verticalDirection = 0;
Ship.horizontalDirection = 1;

export default Ship;
