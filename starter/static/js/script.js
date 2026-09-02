const STORAGE_KEY = "sudoku-leaderboard";

const gridElement = document.getElementById("sudoku-grid");
const difficultySelect = document.getElementById("difficulty-select");
const newGameButton = document.getElementById("new-game-btn");
const checkButton = document.getElementById("check-btn");
const hintButton = document.getElementById("hint-btn");
const timerElement = document.getElementById("timer-display");
const statusElement = document.getElementById("status-message");
const leaderboardList = document.getElementById("scoreboard-list");
const bestScoreDisplay = document.getElementById("best-score-display");
const themeToggleButton = document.getElementById("theme-toggle");

let board = [];
let solution = [];
let timerInterval = null;
let elapsedSeconds = 0;
let hintsUsed = 0;

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? "#b91c1c" : "#1f2937";
}

function startTimer() {
  clearInterval(timerInterval);
  elapsedSeconds = 0;
  timerElement.textContent = formatTime(elapsedSeconds);

  timerInterval = setInterval(() => {
    elapsedSeconds += 1;
    timerElement.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function getLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderLeaderboard() {
  const entries = [...getLeaderboard()].sort((a, b) => a.time - b.time).slice(0, 10);
  leaderboardList.innerHTML = "";

  if (!entries.length) {
    bestScoreDisplay.textContent = "No score yet";
    leaderboardList.innerHTML = `
      <tr>
        <td colspan="5">No scores yet</td>
      </tr>
    `;
    return;
  }

  const bestEntry = entries[0];
  bestScoreDisplay.textContent = `${bestEntry.name} — ${formatTime(bestEntry.time)} — ${bestEntry.difficulty}`;

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    const hintsText = entry.hintsUsed !== undefined ? entry.hintsUsed : 0;
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${formatTime(entry.time)}</td>
      <td>${entry.difficulty}</td>
      <td>${hintsText}</td>
    `;
    leaderboardList.appendChild(row);
  });
}

function addScoreToLeaderboard(name, time, difficulty, hints) {
  const leaderboard = getLeaderboard();
  leaderboard.push({ name, time, difficulty, hintsUsed: hints || 0 });
  leaderboard.sort((a, b) => a.time - b.time);
  saveLeaderboard(leaderboard.slice(0, 10));
  renderLeaderboard();
}

function createCell(rowIndex, colIndex, value, isReadOnly) {
  const cell = document.createElement("input");
  cell.type = "text";
  cell.maxLength = 1;
  cell.inputMode = "numeric";
  cell.value = value === 0 ? "" : String(value);
  cell.dataset.row = String(rowIndex);
  cell.dataset.col = String(colIndex);
  cell.classList.add("cell");

  const boxRow = Math.floor(rowIndex / 3);
  const boxCol = Math.floor(colIndex / 3);
  const blockOffset = (boxRow * 3 + boxCol) % 2;
  if (blockOffset === 0) {
    cell.classList.add("cell-alt");
  }

  if (isReadOnly) {
    cell.classList.add("locked");
    cell.readOnly = true;
    cell.tabIndex = -1;
    return cell;
  }

  cell.addEventListener("input", (event) => {
    const cleaned = event.target.value.replace(/[^1-9]/g, "").slice(0, 1);
    event.target.value = cleaned;

    const row = Number(event.target.dataset.row);
    const col = Number(event.target.dataset.col);
    board[row][col] = cleaned ? Number(cleaned) : 0;
  });

  return cell;
}

function renderBoard() {
  gridElement.innerHTML = "";

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const value = board[row][col];
      const isReadOnly = value !== 0;
      const cell = createCell(row, col, value, isReadOnly);
      gridElement.appendChild(cell);
    }
  }
}

async function fetchNewGame() {
  const difficulty = difficultySelect.value;

  const response = await fetch("/new_game", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ difficulty }),
  });

  const data = await response.json();

  if (!response.ok) {
    setStatus(data.error || "Board setup failed.", true);
    return;
  }

  board = data.puzzle.map((row) => [...row]);
  solution = data.solution.map((row) => [...row]);
  hintsUsed = 0;

  renderBoard();
  startTimer();
  setStatus("New puzzle ready.");
}

function useHint() {
  if (!board.length || !solution.length) {
    setStatus("Start a new game first.", true);
    return;
  }

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] === 0) {
        board[row][col] = solution[row][col];
        hintsUsed += 1;
        renderBoard();
        setStatus(`Clue placed at row ${row + 1}, column ${col + 1}.`);
        return;
      }
    }
  }

  setStatus("No empty cells left to reveal.", true);
}

async function checkBoard() {
  if (!board.length || !solution.length) {
    setStatus("Start a new game first.", true);
    return;
  }

  const response = await fetch("/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board, solution }),
  });

  const data = await response.json();

  if (!response.ok) {
    setStatus(data.error || "Validation failed.", true);
    return;
  }

  const correctSet = new Set(data.correct.map(([row, col]) => `${row}-${col}`));
  const incorrectSet = new Set(data.incorrect.map(([row, col]) => `${row}-${col}`));

  const cells = gridElement.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const key = `${row}-${col}`;

    cell.classList.remove("correct", "incorrect");

    if (correctSet.has(key)) {
      cell.classList.add("correct");
    }

    if (incorrectSet.has(key)) {
      cell.classList.add("incorrect");
    }
  });

  if (data.solved) {
    stopTimer();
    const name = window.prompt("Puzzle complete! Add your name to the board:", "Player") || "Player";
    addScoreToLeaderboard(name, elapsedSeconds, difficultySelect.value, hintsUsed);
    setStatus(`Solved in ${formatTime(elapsedSeconds)} with ${hintsUsed} hint${hintsUsed === 1 ? "" : "s"}!`);
    return;
  }

  setStatus(data.incorrect.length ? "A few entries need attention." : "Keep going!");
}

newGameButton.addEventListener("click", fetchNewGame);
checkButton.addEventListener("click", checkBoard);
hintButton.addEventListener("click", useHint);
difficultySelect.addEventListener("change", fetchNewGame);
themeToggleButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("sudoku_theme", nextTheme);
  themeToggleButton.textContent = nextTheme === "dark" ? "Light Mode" : "Dark Mode";
});

const savedTheme = localStorage.getItem("sudoku_theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggleButton.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

renderLeaderboard();
fetchNewGame();