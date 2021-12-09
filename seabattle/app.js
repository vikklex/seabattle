/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__field__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fleet__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ship__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__computer__ = __webpack_require__(3);





class Game {
  constructor() {
    this.size = 10;
    this.playerField = new __WEBPACK_IMPORTED_MODULE_0__field__["a" /* default */](this.size);
    this.computerField = new __WEBPACK_IMPORTED_MODULE_0__field__["a" /* default */](this.size);
    this.playerFleet = new __WEBPACK_IMPORTED_MODULE_1__fleet__["a" /* default */](this.playerField, Game.commonData.player);
    this.computerFleet = new __WEBPACK_IMPORTED_MODULE_1__fleet__["a" /* default */](
      this.computerField,
      Game.commonData.computer
    );
    this.robot = new __WEBPACK_IMPORTED_MODULE_3__computer__["a" /* default */](this);
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

    if (direction === __WEBPACK_IMPORTED_MODULE_2__ship__["a" /* default */].verticalDirection) {
      event.target.setAttribute("data-direction", "1");
      Game.placeShipDirection = __WEBPACK_IMPORTED_MODULE_2__ship__["a" /* default */].horizontalDirection;
    } else if (direction === __WEBPACK_IMPORTED_MODULE_2__ship__["a" /* default */].horizontalDirection) {
      event.target.setAttribute("data-direction", "0");
      Game.placeShipDirection = __WEBPACK_IMPORTED_MODULE_2__ship__["a" /* default */].verticalDirection;
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
        __WEBPACK_IMPORTED_MODULE_3__computer__["a" /* default */].damagedShipCoordsX.push(x);
        __WEBPACK_IMPORTED_MODULE_3__computer__["a" /* default */].damagedShipCoordsY.push(y);
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

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(0);


class Ship {
  constructor(type, playerGrid, player) {
    this.damage = 0;
    this.type = type;
    this.playerGrid = playerGrid;
    this.player = player;

    switch (this.type) {
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[0]:
        this.shipLength = 4;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[1]:
        this.shipLength = 3;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[2]:
        this.shipLength = 3;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[3]:
        this.shipLength = 2;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[4]:
        this.shipLength = 2;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[5]:
        this.shipLength = 2;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[6]:
        this.shipLength = 1;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[7]:
        this.shipLength = 1;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[8]:
        this.shipLength = 1;
        break;
      case __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.availableShips[9]:
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
            this.playerGrid.cells[x + i][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.miss ||
            this.playerGrid.cells[x + i][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship ||
            (y + i + 1 < 10 &&
              this.playerGrid.cells[x][y + 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              this.playerGrid.cells[x][y - 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x + i + 1 < 10 &&
              this.playerGrid.cells[x + i + 1][y] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x + i + 1 < 10 &&
              y + 1 < 10 &&
              this.playerGrid.cells[x + i + 1][y + 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x + i + 1 < 10 &&
              y - 1 >= 0 &&
              this.playerGrid.cells[x + i + 1][y - 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x + i - 1 >= 0 &&
              this.playerGrid.cells[x + i - 1][y] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x + i - 1 >= 0 &&
              y + 1 < 10 &&
              this.playerGrid.cells[x + i - 1][y + 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x + i - 1 >= 0 &&
              y - 1 >= 0 &&
              this.playerGrid.cells[x + i - 1][y - 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            this.playerGrid.cells[x + i][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.sunk
          ) {
            return false;
          }
        } else {
          if (
            this.playerGrid.cells[x][y + i] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.miss ||
            this.playerGrid.cells[x][y + i] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship ||
            (x + 1 < 10 &&
              this.playerGrid.cells[x + 1][y] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (x - 1 >= 0 &&
              this.playerGrid.cells[x - 1][y] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i + 1 < 10 &&
              this.playerGrid.cells[x][y + i + 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i + 1 < 10 &&
              x + 1 < 10 &&
              this.playerGrid.cells[x + 1][y + i + 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i + 1 < 10 &&
              x - 1 >= 0 &&
              this.playerGrid.cells[x - 1][y + i + 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              this.playerGrid.cells[x][y + i - 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              x + 1 < 10 &&
              this.playerGrid.cells[x + 1][y + i - 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            (y + i - 1 >= 0 &&
              x - 1 >= 0 &&
              this.playerGrid.cells[x - 1][y + i - 1] ===
                __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship) ||
            this.playerGrid.cells[x][y + i] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.sunk
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
          this.playerGrid.cells[x + i][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship;
        } else {
          this.playerGrid.cells[x][y + i] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship;
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
      return __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.sunk;
    }

    return __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.hit;
  }
}

Ship.verticalDirection = 0;
Ship.horizontalDirection = 1;

/* harmony default export */ __webpack_exports__["a"] = (Ship);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getRandom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getRandomFromArray; });
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(0);



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
      __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].gameOver === false &&
      result !== __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].commonData.cellType.miss
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
          randomDirection = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["a" /* getRandomFromArray */])(['xDirection', 'yDirection']);
        }

        randomValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["a" /* getRandomFromArray */])([-1, 1]);

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
        x = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["b" /* getRandom */])(0, 9);
        y = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["b" /* getRandom */])(0, 9);
      }

      if (this.isSunkShipAreaCell(x, y)) {
        continue;
      }
      result = this.game.shoot(x, y, __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].commonData.player);

      if (result === __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].commonData.cellType.hit) {
        this.hasDamagedShip = true;
      } else if (result === __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].commonData.cellType.sunk) {
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

/* harmony default export */ __webpack_exports__["a"] = (Computer);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(0);


class Field {
  constructor(size) {
    this.size = size;
    this.cells = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      let row = [];
      this.cells[i] = row;

      for (let j = 0; j < this.size; j++) {
        row.push(__WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.empty);
      }
    }
  }

  updateCell(x, y, type, targetPlayer) {
    let player = '';
    if (targetPlayer === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.player) {
      player = 'human-player';
    } else if (targetPlayer === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.computer) {
      player = 'computer-player';
    }

    switch (type) {
      case 'empty':
        this.cells[x][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.empty;
        break;
      case 'ship':
        this.cells[x][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship;
        break;
      case 'miss':
        this.cells[x][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.miss;
        break;
      case 'hit':
        this.cells[x][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.hit;
        break;
      case 'sunk':
        this.cells[x][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.sunk;
        break;
      default:
        this.cells[x][y] = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.empty;
        break;
    }

    document
      .querySelector(`.${player} [data-x="${x}"][data-y="${y}"]`)
      .classList.add('grid-cell', `grid-${type}`);
  }

  isMiss(x, y) {
    return this.cells[x][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.miss;
  }

  isUndamagedShip(x, y) {
    return this.cells[x][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.ship;
  }

  isDamagedShip(x, y) {
    return (
      this.cells[x][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.hit ||
      this.cells[x][y] === __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].commonData.cellType.sunk
    );
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Field);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ship__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game__ = __webpack_require__(0);




class Fleet {
  constructor(playerGrid, player) {
    this.numShips = __WEBPACK_IMPORTED_MODULE_2__game__["a" /* default */].commonData.availableShips.length;
    this.playerGrid = playerGrid;
    this.player = player;
    this.fleetList = [];
    this.populate();
  }

  populate() {
    for (let i = 0; i < this.numShips; i++) {
      this.fleetList.push(
        new __WEBPACK_IMPORTED_MODULE_1__ship__["a" /* default */](
          __WEBPACK_IMPORTED_MODULE_2__game__["a" /* default */].commonData.availableShips[i],
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
        x = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["b" /* getRandom */])(0, 9);
        y = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["b" /* getRandom */])(0, 9);
        direction = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utilities__["b" /* getRandom */])(0, 1);

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
      if (ship.direction === __WEBPACK_IMPORTED_MODULE_1__ship__["a" /* default */].verticalDirection) {
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

/* harmony default export */ __webpack_exports__["a"] = (Fleet);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(0);


const game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */]();


/***/ })
/******/ ]);