import copy
import random


def find_empty(board):
    """Return the first empty cell as (row, col), or None if the board is full."""
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                return row, col
    return None


def is_valid(board, row, col, num):
    """Return True if placing num at (row, col) is legal for the current board."""
    if not 1 <= num <= 9:
        return False

    # Row check
    if num in board[row]:
        return False

    # Column check
    if any(board[r][col] == num for r in range(9)):
        return False

    # 3x3 subgrid check
    start_row = (row // 3) * 3
    start_col = (col // 3) * 3
    for r in range(start_row, start_row + 3):
        for c in range(start_col, start_col + 3):
            if board[r][c] == num:
                return False

    return True


def solve(board):
    """Solve a Sudoku board in-place using backtracking.

    Returns:
        bool: True if the board is solvable, otherwise False.
    """
    empty = find_empty(board)
    if empty is None:
        return True

    row, col = empty
    for num in range(1, 10):
        if is_valid(board, row, col, num):
            board[row][col] = num
            if solve(board):
                return True
            board[row][col] = 0

    return False


def count_solutions(board, limit=2):
    """Count how many valid solutions exist for a board, stopping early at limit.

    This is used to verify puzzle uniqueness by checking whether the board has
    exactly one valid completion.

    Args:
        board (list[list[int]]): The Sudoku board state.
        limit (int): Maximum number of solutions to count before stopping.

    Returns:
        int: The number of solutions found, capped at limit.
    """
    if limit <= 0:
        return 0

    empty = find_empty(board)
    if empty is None:
        return 1

    row, col = empty
    solutions_found = 0

    for num in range(1, 10):
        if is_valid(board, row, col, num):
            board[row][col] = num
            solutions_found += count_solutions(board, limit - solutions_found)
            board[row][col] = 0

            if solutions_found >= limit:
                return solutions_found

    return solutions_found


def generate_full_board():
    """Generate a completely filled valid Sudoku board.

    Returns:
        list[list[int]]: A solved 9x9 Sudoku board.
    """
    board = [[0 for _ in range(9)] for _ in range(9)]
    if not solve(board):
        raise ValueError("Unable to generate a valid Sudoku board.")
    return board


def remove_numbers(board, difficulty):
    """Remove cells from a solved board while preserving uniqueness.

    The function removes numbers according to difficulty and verifies after each
    removal that the resulting puzzle still has exactly one solution.

    Args:
        board (list[list[int]]): A solved Sudoku board.
        difficulty (str): One of {'easy', 'medium', 'hard'}.

    Returns:
        list[list[int]]: A puzzle board with some cells removed.
    """
    difficulty_map = {
        "easy": 32,    # remove ~30-35 cells
        "medium": 42,  # remove ~40-45 cells
        "hard": 52,    # remove ~50-55 cells
    }

    difficulty = difficulty.lower()
    target_removals = difficulty_map.get(difficulty, difficulty_map["medium"])

    puzzle = copy.deepcopy(board)
    cells = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(cells)

    removed = 0
    for row, col in cells:
        if removed >= target_removals:
            break

        backup = puzzle[row][col]
        puzzle[row][col] = 0

        # Only keep the removal if the puzzle still has exactly one solution.
        if count_solutions(copy.deepcopy(puzzle), limit=2) != 1:
            puzzle[row][col] = backup
        else:
            removed += 1

    return puzzle


def generate_puzzle(difficulty="medium"):
    """Generate a puzzle and its unique solution.

    Args:
        difficulty (str): The puzzle difficulty. Supported values:
            easy, medium, hard.

    Returns:
        tuple[list[list[int]], list[list[int]]]:
            A (puzzle, solution) pair where the puzzle has exactly one solution.
    """
    difficulty = difficulty.lower()
    if difficulty not in {"easy", "medium", "hard"}:
        difficulty = "medium"

    solution = generate_full_board()
    puzzle = remove_numbers(solution, difficulty)

    return puzzle, solution
