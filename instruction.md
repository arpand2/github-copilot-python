# Project Instruction File

## Project purpose
This project is a Python Flask Sudoku game that must generate valid puzzles with exactly one solution, track solve time, support difficulty selection, provide hints, and persist a top-10 scoreboard in browser localStorage.

## Required direction for Copilot
Follow these rules in all generated code:

- Keep Sudoku logic in `sudoku.py` and web request handling in `app.py`.
- Do not put business logic inside Flask route functions.
- Use `copy.deepcopy` whenever a board needs to be copied so original board state is never mutated.
- Implement `count_solutions(board, limit=2)` correctly and use it when removing numbers to preserve puzzle uniqueness.
- Ensure each generated puzzle has exactly one valid solution before being returned to the frontend.
- Keep the UI clean, semantic, and responsive.
- Keep a live timer, validate user answers, and persist top-10 times in localStorage under the key `sudoku-leaderboard`.
- Use a classic Sudoku grid appearance with thick 3x3 borders and alternating block backgrounds.
- Add a dark/light mode toggle.
- Show the leaderboard as a clear table with columns for Rank, Name, Time, Difficulty, and Hints.
- Add a hint button that fills one valid cell and records the number of hints used.
- Keep the code readable, modular, and maintainable.

## Design and review expectations
- Prefer small, well-named functions and clear docstrings.
- Reject or improve any Copilot suggestion that introduces an unvalidated shortcut, weak uniqueness logic, or bad UI behavior.
- Critically review AI-generated code before accepting it.
- If a suggestion is weak, revise it manually to match the project requirements.

## Submission checklist
Before final submission, verify that:
- puzzle generation works for Easy, Medium, and Hard
- each puzzle has exactly one solution
- the timer works and resets correctly
- the check button highlights incorrect cells
- hints count toward the final score
- the top 10 leaderboard is saved in localStorage
- the UI includes a dark/light toggle
- the project includes a descriptive instruction file and a clear README
- screenshots are named descriptively and stored in a Screenshots folder
