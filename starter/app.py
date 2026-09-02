from flask import Flask, jsonify, render_template, request

from sudoku import generate_puzzle

app = Flask(__name__)

VALID_DIFFICULTIES = {"easy", "medium", "hard"}


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/new_game")
@app.post("/api/new_game")
def new_game():
    payload = request.get_json(silent=True) or {}
    difficulty = (payload.get("difficulty") or "medium").lower()

    if difficulty not in VALID_DIFFICULTIES:
        return jsonify({"error": "Invalid difficulty. Choose easy, medium, or hard."}), 400

    puzzle, solution = generate_puzzle(difficulty)
    return jsonify({"puzzle": puzzle, "solution": solution})


@app.post("/check")
@app.post("/api/check")
def check():
    payload = request.get_json(silent=True) or {}
    board = payload.get("board")
    solution = payload.get("solution")

    if not isinstance(board, list) or len(board) != 9:
        return jsonify({"error": "Board must be a 9x9 grid."}), 400

    if not isinstance(solution, list) or len(solution) != 9:
        return jsonify({"error": "Solution must be a 9x9 grid."}), 400

    correct = []
    incorrect = []

    for row_index, row in enumerate(board):
        if not isinstance(row, list) or len(row) != 9:
            return jsonify({"error": "Each row must contain 9 values."}), 400

        for col_index, value in enumerate(row):
            if value != 0 and value == solution[row_index][col_index]:
                correct.append([row_index, col_index])
            else:
                incorrect.append([row_index, col_index])

    solved = not incorrect and all(value != 0 for row in board for value in row)
    return jsonify({"correct": correct, "incorrect": incorrect, "solved": solved})


if __name__ == "__main__":
    app.run(debug=True)