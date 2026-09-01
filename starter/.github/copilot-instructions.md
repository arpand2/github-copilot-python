# GitHub Copilot Instructions for the Flask Sudoku Project

## Project goal
Build a Python Flask Sudoku web app that generates valid puzzles, checks for unique solutions, tracks solve time, validates live input, and presents a polished, responsive UI.

## Required architecture
- Keep all Sudoku logic in sudoku.py.
- Keep Flask routes, session state, and API endpoints in app.py.
- Keep browser behavior in static/js/.
- Keep page templates in templates/.
- Keep styles in static/css/ or static/styles.css.
- Prefer small, readable, modular functions over large monolithic code blocks.
- Preserve a clean separation between backend logic, frontend logic, and presentation.

## Core Sudoku rules
- Generate a valid 9x9 Sudoku board.
- Support difficulty levels: easy, medium, hard.
- Every generated puzzle must have exactly one valid solution.
- Do not accept any puzzle with multiple solutions.
- Easy puzzles should have more clues than medium and hard puzzles.
- Hard puzzles should have fewer clues and remain solvable by the solver logic.

## Backend requirements
- sudoku.py must contain:
  - board generation
  - validation helpers
  - solving logic
  - uniqueness checking for puzzles
  - difficulty-based puzzle generation
- Implement a uniqueness check that confirms there is exactly one valid solution before returning a puzzle.
- Keep board operations predictable, testable, and easy to maintain.
- Return clear API errors when there is no active game or invalid board state.
- Prefer JSON-based responses for frontend requests when appropriate.

## Frontend requirements
- Use JavaScript to handle board interaction and UI updates.
- Start the timer when a new game is created.
- Update the timer live while the player is solving.
- Show immediate feedback for each cell:
  - correct entry = valid styling
  - incorrect entry = invalid/error styling
  - fixed clue = neutral locked-cell styling
- Support both click and keyboard input.
- Highlight invalid values as soon as they are entered.
- Add a Check button that compares the current board to the solved board.
- Add a Hint button that reveals one correct value while tracking hint usage.
- Keep the interaction smooth and intuitive for desktop and mobile users.

## Leaderboard requirements
- Save the top 10 scores in browser localStorage.
- Each leaderboard entry should include:
  - player name
  - solve time
  - hints used
  - difficulty
  - timestamp or date
- Sort leaderboard entries by shortest time first.
- If times tie, prefer fewer hints used.
- Display the leaderboard on the page clearly and consistently.

## UX requirements
- Use a clean, modern, accessible visual style.
- Maintain strong contrast and readable text.
- Make the board responsive for mobile and desktop layouts.
- Show a win message when the player completes the puzzle correctly.
- After solving, show the time taken and hints used.
- Ask for the player name when a qualifying score should be added to the leaderboard.
- Keep the interface uncluttered and easy to understand.

## Code quality expectations
- Prefer descriptive function and variable names.
- Keep logic separated from rendering and view code.
- Avoid duplication.
- Do not place all logic into one file.
- Do not mix frontend DOM logic into Flask route handlers.
- Do not put Sudoku puzzle generation or uniqueness validation in the browser as the source of truth.
- Do not add unnecessary complexity or over-engineering.
- Keep comments minimal and only use them when they improve clarity.

## Required behavior checklist
- New game generation creates a valid puzzle with exactly one solution.
- Easy, medium, and hard levels produce different clue counts.
- Live time tracking is visible and updates continuously.
- Wrong entries are visually marked as incorrect immediately.
- The game checks solution correctness reliably.
- A player can request hints without breaking the underlying logic.
- The leaderboard stores the top 10 entries in localStorage.
- The project remains easy to extend and maintain.

## Avoid these patterns
- Do not generate puzzles without verifying uniqueness.
- Do not skip validation of board correctness.
- Do not hardcode leaderboard data without using localStorage.
- Do not mix route logic, Sudoku logic, and UI behavior in a single block.
- Do not allow invalid puzzle states to pass silently.
- Do not create fragile or overly coupled code.

## Preferred style
- Favor clean Flask route handlers.
- Favor JSON API responses for interactive game updates.
- Favor small JavaScript utilities for DOM updates and board state management.
- Favor session-based server state when needed for puzzle tracking.
- Favor maintainable code patterns that future Copilot generations can extend safely.