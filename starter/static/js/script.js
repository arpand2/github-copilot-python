let board = [], locked = [], timerInterval, seconds = 0, currentDifficulty = "medium";

const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
const timerEl = document.getElementById("timer");

function isBoxAlt(r, c) {
  return (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0;
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell" + (isBoxAlt(r, c) ? " box-alt" : "");
      const val = board[r][c];
      if (locked[r][c]) {
        cell.classList.add("locked");
        cell.textContent = val || "";
      } else {
        const input = document.createElement("input");
        input.maxLength = 1;
        input.inputMode = "numeric";
        input.value = val || "";
        input.addEventListener("input", (e) => {
          const v = e.target.value.replace(/[^1-9]/g, "");
          e.target.value = v;
          board[r][c] = v ? parseInt(v) : 0;
        });
        cell.appendChild(input);
      }
      boardEl.appendChild(cell);
    }
  }
}

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerEl.textContent = "00:00";
  timerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
  }, 1000);
}

async function newGame() {
  currentDifficulty = document.getElementById("difficulty").value;
  const res = await fetch("/api/new_game", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ difficulty: currentDifficulty }),
  });
  const data = await res.json();
  board = data.puzzle;
  locked = board.map(row => row.map(v => v !== 0));
  messageEl.textContent = "";
  renderBoard();
  startTimer();
}

async function checkBoard() {
  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board }),
  });
  const data = await res.json();
  document.querySelectorAll(".cell").forEach(c => c.classList.remove("error"));
  data.errors.forEach(([r, c]) => {
    boardEl.children[r * 9 + c].classList.add("error");
  });
  if (data.solved) {
    clearInterval(timerInterval);
    messageEl.textContent = `Solved in ${timerEl.textContent}! 🎉`;
    promptForLeaderboard(seconds);
  } else {
    messageEl.textContent = data.errors.length ? "Some entries are incorrect." : "Keep going!";
  }
}

async function useHint() {
  const res = await fetch("/api/hint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board }),
  });
  const data = await res.json();
  if (data.hint) {
    const { row, col, value } = data.hint;
    board[row][col] = value;
    locked[row][col] = true;
    renderBoard();
  }
}

function getLeaderboard() {
  return JSON.parse(localStorage.getItem("sudoku_leaderboard") || "[]");
}

function saveLeaderboard(list) {
  localStorage.setItem("sudoku_leaderboard", JSON.stringify(list));
}

function promptForLeaderboard(timeSeconds) {
  const list = getLeaderboard();
  const worstTime = list.length >= 10 ? list[list.length - 1].time : Infinity;
  if (list.length < 10 || timeSeconds < worstTime) {
    const name = prompt("New top 10 time! Enter your name:") || "Anonymous";
    list.push({ name, time: timeSeconds, difficulty: currentDifficulty });
    list.sort((a, b) => a.time - b.time);
    saveLeaderboard(list.slice(0, 10));
    renderLeaderboard();
  }
}

function renderLeaderboard() {
  const listEl = document.getElementById("leaderboard-list");
  listEl.innerHTML = "";
  getLeaderboard().forEach(entry => {
    const m = String(Math.floor(entry.time / 60)).padStart(2, "0");
    const s = String(entry.time % 60).padStart(2, "0");
    const li = document.createElement("li");
    li.textContent = `${entry.name} — ${m}:${s} (${entry.difficulty})`;
    listEl.appendChild(li);
  });
}

document.getElementById("new-game").addEventListener("click", newGame);
document.getElementById("check-btn").addEventListener("click", checkBoard);
document.getElementById("hint-btn").addEventListener("click", useHint);
document.getElementById("theme-toggle").addEventListener("click", () => {
  const html = document.documentElement;
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  html.dataset.theme = next;
  localStorage.setItem("sudoku_theme", next);
});

document.documentElement.dataset.theme = localStorage.getItem("sudoku_theme") || "light";
renderLeaderboard();
newGame();