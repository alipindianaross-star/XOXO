
// DOM Elements
const cells = document.querySelectorAll(".cell");
const messageDisplay = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

// Sounds
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const tieSound = document.getElementById("tieSound");
const restartSound = document.getElementById("restartSound");

// Game State
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

// Winning Conditions
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = clickedCell.getAttribute("data-index");

  if (board[clickedIndex] !== "" || !isGameActive) return;

  board[clickedIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  clickSound.play();

  checkResult();
  if (isGameActive && currentPlayer === "X") {
    computerMove();
  }
}

function checkWinner() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes("")) return "tie";
  return null;
}

function checkResult() {
  const winner = checkWinner();
  if (winner) {
    isGameActive = false;
    messageDisplay.textContent = winner === "tie" ? "It's Atay!" : `${winner} Wins!`;
    winner === "tie" ? tieSound.play() : winSound.play();
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  messageDisplay.textContent = "";
  cells.forEach(cell => cell.textContent = "");
  restartSound.play();
}

function computerMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== undefined) {
    board[move] = "O";
    cells[move].textContent = "O";
    clickSound.play();
    checkResult();
  }
}

function minimax(board, depth, isMaximizing) {
  const result = checkWinner();
  if (result === "X") return -1;
  if (result === "O") return 1;
  if (result === "tie") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);

document.body.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
  }
}, { once: true });