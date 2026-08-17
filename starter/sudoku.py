import random
import copy

def _find_empty(board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                return r, c
    return None

def _valid(board, num, pos):
    r, c = pos
    if num in board[r]:
        return False
    if num in [board[i][c] for i in range(9)]:
        return False
    box_r, box_c = 3 * (r // 3), 3 * (c // 3)
    for i in range(box_r, box_r + 3):
        for j in range(box_c, box_c + 3):
            if board[i][j] == num:
                return False
    return True

def solve(board):
    empty = _find_empty(board)
    if not empty:
        return True
    r, c = empty
    nums = list(range(1, 10))
    random.shuffle(nums)
    for num in nums:
        if _valid(board, num, (r, c)):
            board[r][c] = num
            if solve(board):
                return True
            board[r][c] = 0
    return False

def generate_full_board():
    board = [[0] * 9 for _ in range(9)]
    solve(board)
    return board

def count_solutions(board, limit=2):
    empty = _find_empty(board)
    if not empty:
        return 1
    r, c = empty
    count = 0
    for num in range(1, 10):
        if _valid(board, num, (r, c)):
            board[r][c] = num
            count += count_solutions(board, limit - count)
            board[r][c] = 0
            if count >= limit:
                break
    return count

DIFFICULTY_CLUES = {"easy": 40, "medium": 32, "hard": 24}

def generate_puzzle(difficulty="medium"):
    solution = generate_full_board()
    puzzle = copy.deepcopy(solution)
    target_clues = DIFFICULTY_CLUES.get(difficulty, 32)
    cells = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(cells)
    clues_remaining = 81
    for (r, c) in cells:
        if clues_remaining <= target_clues:
            break
        backup = puzzle[r][c]
        puzzle[r][c] = 0
        if count_solutions(copy.deepcopy(puzzle)) != 1:
            puzzle[r][c] = backup
        else:
            clues_remaining -= 1
    return puzzle, solution

def is_valid_move(board, num, pos):
    return _valid(board, num, pos)