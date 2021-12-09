import Game from './game';

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
        row.push(Game.commonData.cellType.empty);
      }
    }
  }

  updateCell(x, y, type, targetPlayer) {
    let player = '';
    if (targetPlayer === Game.commonData.player) {
      player = 'human-player';
    } else if (targetPlayer === Game.commonData.computer) {
      player = 'computer-player';
    }

    switch (type) {
      case 'empty':
        this.cells[x][y] = Game.commonData.cellType.empty;
        break;
      case 'ship':
        this.cells[x][y] = Game.commonData.cellType.ship;
        break;
      case 'miss':
        this.cells[x][y] = Game.commonData.cellType.miss;
        break;
      case 'hit':
        this.cells[x][y] = Game.commonData.cellType.hit;
        break;
      case 'sunk':
        this.cells[x][y] = Game.commonData.cellType.sunk;
        break;
      default:
        this.cells[x][y] = Game.commonData.cellType.empty;
        break;
    }

    document
      .querySelector(`.${player} [data-x="${x}"][data-y="${y}"]`)
      .classList.add('grid-cell', `grid-${type}`);
  }

  isMiss(x, y) {
    return this.cells[x][y] === Game.commonData.cellType.miss;
  }

  isUndamagedShip(x, y) {
    return this.cells[x][y] === Game.commonData.cellType.ship;
  }

  isDamagedShip(x, y) {
    return (
      this.cells[x][y] === Game.commonData.cellType.hit ||
      this.cells[x][y] === Game.commonData.cellType.sunk
    );
  }
}

export default Field;
