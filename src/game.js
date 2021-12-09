import Field from "./field";
import Fleet from "./fleet";
import Ship from "./ship";
import Computer from "./computer";

class Game {
  constructor() {
    this.size = 10;
    this.playerField = new Field(this.size);
    this.computerField = new Field(this.size);
    this.playerFleet = new Fleet(this.playerField, Game.commonData.player);
    this.computerFleet = new Fleet(
      this.computerField,
      Game.commonData.computer
    );
    this.robot = new Computer(this);
    this.readyToPlay = false;
    this.placingOnGrid = false;
    this.drawBattlefields();
    this.init();
  }

  drawBattlefields() {
    const fieldContainers = document.querySelectorAll(".grid");

    for (let i = 0; i < fieldContainers.length; i++) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          let cell = document.createElement("div");
          cell.setAttribute("data-x", x);
          cell.setAttribute("data-y", y);
          cell.classList.add("grid-cell");
          fieldContainers[i].appendChild(cell);
        }
      }
    }
  }

  fleetClickHandler(event) {
    const fleetList = document.querySelectorAll(".fleet-list li");

    for (let ship of fleetList) {
      ship.classList.remove("placing");
    }

    Game.placeShipType = event.target.getAttribute("id");
    document.getElementById(Game.placeShipType).classList.add("placing");
    Game.placeShipDirection = parseInt(
      document.getElementById("rotate-button").getAttribute("data-direction"),
      10
    );

    this.placingOnGrid = true;
  }

  positioningMouseoverHandler(event) {
    if (this.placingOnGrid) {
      const x = parseInt(event.target.getAttribute("data-x"), 10);
      const y = parseInt(event.target.getAttribute("data-y"), 10);
      const fleetList = this.playerFleet.fleetList;

      for (let ship of fleetList) {
        if (
          Game.placeShipType === ship.type &&
          ship.isLegal(x, y, Game.placeShipDirection)
        ) {
          ship.create(x, y, Game.placeShipDirection, true);
          Game.placeShipCoords = ship.getAllShipCells();

          for (let coord of Game.placeShipCoords) {
            let cell = document.querySelector(
              `[data-x="${coord.x}"][data-y="${coord.y}"]`
            );

            if (!cell.classList.contains("grid-ship")) {
              cell.classList.add("grid-ship");
            }
          }
        }
      }
    }
  }

  positioningMouseoutHandler(event) {
    if (this.placingOnGrid) {
      for (let coord of Game.placeShipCoords) {
        let cell = document.querySelector(
          `[data-x="${coord.x}"][data-y="${coord.y}"]`
        );

        if (cell.classList.contains("grid-ship")) {
          cell.classList.remove("grid-ship");
        }
      }
    }
  }

  placingHandler(event) {
    if (this.placingOnGrid) {
      const x = parseInt(event.target.getAttribute("data-x"), 10);
      const y = parseInt(event.target.getAttribute("data-y"), 10);
      const successful = this.playerFleet.placeShip(
        x,
        y,
        Game.placeShipDirection,
        Game.placeShipType
      );

      if (successful) {
        document.getElementById(Game.placeShipType).classList.add("placed");
        Game.placeShipDirection = null;
        Game.placeShipType = "";
        Game.placeShipCoords = [];
        this.placingOnGrid = false;

        if (this.areAllShipsPlaced()) {
          document.getElementById("rotate-button").classList.add("hidden");
          document.getElementById("start-game").classList = "highlight";
        }
      }
    }
  }

  areAllShipsPlaced() {
    const fleetList = document.querySelectorAll(".fleet-list li");

    for (let ship of fleetList) {
      if (ship.classList.contains("placed")) {
        continue;
      } else {
        return false;
      }
    }

    return true;
  }

  toggleRotationHandler(event) {
    const direction = parseInt(event.target.getAttribute("data-direction"), 10);

    if (direction === Ship.verticalDirection) {
      event.target.setAttribute("data-direction", "1");
      Game.placeShipDirection = Ship.horizontalDirection;
    } else if (direction === Ship.horizontalDirection) {
      event.target.setAttribute("data-direction", "0");
      Game.placeShipDirection = Ship.verticalDirection;
    }
  }

  startGameHandler(event) {
    this.readyToPlay = true;
    document.getElementById("fleet-sidebar").classList.add("hidden");
  }

  shoot(x, y, targetPlayer) {
    let targetGrid = null;
    let targetFleet = null;
    let result = null;

    if (targetPlayer === Game.commonData.player) {
      targetGrid = this.playerField;
      targetFleet = this.playerFleet;
    } else if (targetPlayer === Game.commonData.computer) {
      targetGrid = this.computerField;
      targetFleet = this.computerFleet;
    }

    if (targetGrid.isDamagedShip(x, y) || targetGrid.isMiss(x, y)) {
      return result;
    } else if (targetGrid.isUndamagedShip(x, y)) {
      targetGrid.updateCell(x, y, "hit", targetPlayer);
      result = targetFleet.findShipByCoords(x, y).incrementDamage();
      this.checkForGameOver();

      if (
        targetPlayer === Game.commonData.player &&
        result === Game.commonData.cellType.hit
      ) {
        Computer.damagedShipCoordsX.push(x);
        Computer.damagedShipCoordsY.push(y);
      }

      return result;
    } else {
      targetGrid.updateCell(x, y, "miss", targetPlayer);
      result = Game.commonData.cellType.miss;
      return result;
    }
  }

  shootHandler(event) {
    const x = parseInt(event.target.getAttribute("data-x"), 10);
    const y = parseInt(event.target.getAttribute("data-y"), 10);
    let result = null;

    if (this.readyToPlay) {
      result = this.shoot(x, y, Game.commonData.computer);
    }

    if (!Game.gameOver && result === Game.commonData.cellType.miss) {
      this.robot.shoot();
    }
  }

  checkForGameOver() {
    if (this.computerFleet.areAllShipsSunk()) {
      alert("Поздравляю, вы победили!");
      Game.gameOver = true;
    } else if (this.playerFleet.areAllShipsSunk()) {
      alert("К сожалению, вы проиграли. Компьютер потопил все ваши корабли");
      Game.gameOver = true;
    }
  }

  init() {
    let fleetList = document
      .querySelector(".fleet-list")
      .querySelectorAll("li");
    let computerCells = document.querySelector(".computer-player").childNodes;
    let playerCells = document.querySelector(".human-player").childNodes;

    for (let ship of fleetList) {
      ship.addEventListener("click", this.fleetClickHandler.bind(this), false);
    }

    for (let computerCell of computerCells) {
      computerCell.addEventListener(
        "click",
        this.shootHandler.bind(this),
        false
      );
    }

    for (let playerCell of playerCells) {
      playerCell.addEventListener(
        "click",
        this.placingHandler.bind(this),
        false
      );
      playerCell.addEventListener(
        "mouseover",
        this.positioningMouseoverHandler.bind(this),
        false
      );
      playerCell.addEventListener(
        "mouseout",
        this.positioningMouseoutHandler.bind(this),
        false
      );
    }

    document
      .getElementById("rotate-button")
      .addEventListener("click", this.toggleRotationHandler, false);
    document
      .getElementById("start-game")
      .addEventListener("click", this.startGameHandler.bind(this), false);

    this.computerFleet.placeComputerShipsRandomly();
  }
}

Game.gameOver = false;
Game.placeShipDirection = null;
Game.placeShipType = "";
Game.placeShipCoords = [];
Game.commonData = {
  availableShips: [
    "aerocarrier",
    "submarine",
    "submarine2",
    "galeon",
    "galeon2",
    "galeon3",
    "boat",
    "boat2",
    "boat3",
    "boat4",
  ],
  player: 0,
  computer: 1,
  cellType: {
    empty: 0,
    ship: 1,
    miss: 2,
    hit: 3,
    sunk: 4,
  },
};

export default Game;
