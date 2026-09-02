import copy

from sudoku import count_solutions, generate_puzzle, is_valid


def test_generate_puzzle_easy_has_unique_solution():
    puzzle, _ = generate_puzzle("easy")
    assert count_solutions(copy.deepcopy(puzzle), limit=2) == 1


def test_generate_puzzle_medium_has_unique_solution():
    puzzle, _ = generate_puzzle("medium")
    assert count_solutions(copy.deepcopy(puzzle), limit=2) == 1


def test_generate_puzzle_hard_has_unique_solution():
    puzzle, _ = generate_puzzle("hard")
    assert count_solutions(copy.deepcopy(puzzle), limit=2) == 1


def test_generate_puzzle_solution_solves_the_puzzle():
    for difficulty in ("easy", "medium", "hard"):
        puzzle, solution = generate_puzzle(difficulty)

        for row in range(9):
            for col in range(9):
                if puzzle[row][col] == 0:
                    assert solution[row][col] != 0
                else:
                    assert puzzle[row][col] == solution[row][col]


def test_is_valid_rejects_illegal_placements():
    board = [[0 for _ in range(9)] for _ in range(9)]
    assert is_valid(board, 0, 0, 5) is True

    board[0][1] = 5
    assert is_valid(board, 0, 0, 5) is False

    board = [[0 for _ in range(9)] for _ in range(9)]
    board[1][0] = 5
    assert is_valid(board, 0, 0, 5) is False

    board = [[0 for _ in range(9)] for _ in range(9)]
    board[0][0] = 5
    assert is_valid(board, 0, 0, 5) is False


def test_count_solutions_unique_and_multiple():
    puzzle, _ = generate_puzzle("easy")
    assert count_solutions(copy.deepcopy(puzzle), limit=2) == 1

    board = [[0 for _ in range(9)] for _ in range(9)]
    board[0][0] = 1
    assert count_solutions(board, limit=2) > 1
