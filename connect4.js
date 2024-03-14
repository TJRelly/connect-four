/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(player1, player2, height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.player1 = player1;
    this.player2 = player2;
    this.currPlayer = player1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.gameOver = false;
    this.handleClick = this.handleClick.bind(this);
    this.findSpotForCol = this.findSpotForCol.bind(this);
    this.placeInTable = this.placeInTable.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const { handleClick, width, height } = this;
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    for (let x = 0; x < width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.background = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    setTimeout(() => alert(msg), 100);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (!this.gameOver) {
      const { endGame, board, findSpotForCol, placeInTable, checkForWin } =
        this;
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      board[y][x] = this.currPlayer;
      placeInTable(y, x);

      // check for win
      if (checkForWin()) {
        this.gameOver = true;
        console.log(this.currPlayer);
        return endGame(`The ${this.currPlayer.color} player won!`);
      }

      // check for tie
      if (board.every((row) => row.every((cell) => cell))) {
        return endGame("Tie!");
      }

      // switch players
      this.currPlayer =
        this.currPlayer === this.player1 ? this.player2 : this.player1;
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      const { height, width, board, currPlayer } = this;
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < height &&
          x >= 0 &&
          x < width &&
          board[y][x] === currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  // Start or Restart the game
  startGame() {
    let form = document.querySelector(".start-game");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const board = document.querySelector("#board");
      const player1 = document.querySelector(".player1");
      const player2 = document.querySelector(".player2");
      const form = document.querySelector("form")
      // Clears the displayed board
      board.innerHTML = "";
      // Clears the board grid
      this.board = [];
      this.gameOver = false;
      this.makeBoard();
      this.makeHtmlBoard();
      this.player1.color = player1.value ? player1.value : "red";
      this.player2.color = player2.value ? player2.value : "blue";
      form.reset()
    });
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

let player1 = new Player();
let player2 = new Player();

let game = new Game(player1, player2);
game.makeBoard();
game.makeHtmlBoard();
game.startGame();
