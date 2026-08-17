import sys, os, copy
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from sudoku import generate_full_board, generate_puzzle, count_solutions

def test_full_board_is_valid():
    board = generate_full_board()
    for row in board:
        assert sorted(row) == list(range(1, 10))
    for c in range(9):
        assert sorted(board[r][c] for r in range(9)) == list(range(1, 10))

def test_puzzle_has_unique_solution():
    puzzle, _ = generate_puzzle("hard")
    assert count_solutions(copy.deepcopy(puzzle)) == 1

def test_clues_match_solution():
    puzzle, solution = generate_puzzle("easy")
    for r in range(9):
        for c in range(9):
            if puzzle[r][c] != 0:
                assert puzzle[r][c] == solution[r][c]

def test_difficulty_ordering():
    easy, _ = generate_puzzle("easy")
    hard, _ = generate_puzzle("hard")
    clues = lambda b: sum(1 for row in b for v in row if v != 0)
    assert clues(easy) > clues(hard)