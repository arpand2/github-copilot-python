# GitHub Copilot Instructions for the Flask Sudoku Project

## Project goals
- Build a Python Flask Sudoku game with valid random puzzle generation.
- Support Easy, Medium, and Hard difficulty.
- Guarantee every generated puzzle has exactly one valid solution.
- Keep Sudoku logic in `sudoku.py` and Flask routes in `app.py`.
- Keep the frontend in `static/js/` and `templates/`.

## Coding standards
- Use clear, descriptive function names and docstrings.
- Keep route handlers thin and delegate puzzle logic to the Sudoku module.
- Use `copy.deepcopy` whenever a board must be copied so the original board is never mutated.
- Prefer small, readable functions over large monolithic blocks.
- Preserve a clean separation of concerns:
  - `sudoku.py`: generation, solving, uniqueness checks
  - `app.py`: request handling and JSON responses
  - `static/js/script.js`: frontend logic, timer, validation, leaderboard
  - `templates/index.html`: structure and required UI elements

## Sudoku logic rules
- `is_valid(board, row, col, num)` must validate row, column, and 3x3 box constraints only.
- `solve(board)` must mutate the board in place and return `True`/`False` using backtracking.
- `count_solutions(board, limit=2)` must stop early once the count reaches the limit.
- `generate_full_board()` must create a fully valid solved Sudoku board.
- `remove_numbers(board, difficulty)` must remove cells while ensuring exactly one solution remains.
- `generate_puzzle(difficulty="medium")` must return `(puzzle, solution)` and normalize invalid difficulty values to `medium`.

## Difficulty mapping
- `easy`: remove about 30–35 cells
- `medium`: remove about 40–45 cells
- `hard`: remove about 50–55 cells

## Frontend rules
- Use a 9x9 grid with explicit 3x3 block boundaries.
- Lock prefilled cells and allow only digits 1–9 for user input.
- Show live feedback for correct and incorrect cells.
- Use a timer that starts when a new game begins and stops when the puzzle is solved.
- Persist the leaderboard in `localStorage` under the key `sudoku-leaderboard`.
- Sort leaderboard entries by fastest time ascending, top 10 only.

## Testing requirements
- Add pytest tests for Sudoku logic.
- Test uniqueness for Easy/Medium/Hard generated puzzles.
- Verify the generated solution actually solves the puzzle.
- Validate `is_valid` on illegal placements.
- Validate `count_solutions` for both unique and multiple-solution boards.
- Keep tests fast and avoid unnecessary heavy computation.

## Output expectations
- Do not add hidden business logic to Flask routes.
- Do not duplicate Sudoku solving logic in the frontend.
- Keep code clean, readable, and consistent with the conventions above.
