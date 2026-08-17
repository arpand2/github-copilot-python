from flask import Flask, render_template, request, jsonify, session
from sudoku import generate_puzzle, DIFFICULTY_CLUES
import os, random

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key-change-me")

@app.route("/")
def index():
    return render_template("index.html", difficulties=list(DIFFICULTY_CLUES.keys()))

@app.route("/api/new_game", methods=["POST"])
def new_game():
    difficulty = request.get_json().get("difficulty", "medium")
    puzzle, solution = generate_puzzle(difficulty)
    session["solution"] = solution
    session["puzzle"] = puzzle
    return jsonify({"puzzle": puzzle, "difficulty": difficulty})

@app.route("/api/check", methods=["POST"])
def check():
    board = request.get_json().get("board")
    solution = session.get("solution")
    if not solution:
        return jsonify({"error": "No active game"}), 400
    errors, solved = [], True
    for r in range(9):
        for c in range(9):
            v = board[r][c]
            if v == 0:
                solved = False
            elif v != solution[r][c]:
                errors.append([r, c])
                solved = False
    return jsonify({"errors": errors, "solved": solved})

@app.route("/api/hint", methods=["POST"])
def hint():
    board = request.get_json().get("board")
    solution = session.get("solution")
    if not solution:
        return jsonify({"error": "No active game"}), 400
    empty = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]
    if not empty:
        return jsonify({"hint": None})
    r, c = random.choice(empty)
    return jsonify({"hint": {"row": r, "col": c, "value": solution[r][c]}})

if __name__ == "__main__":
    app.run(debug=True)