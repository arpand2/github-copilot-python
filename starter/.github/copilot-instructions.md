# Project Standards for Copilot

- Python 3.11+, PEP 8, type hints on all function signatures.
- Flask backend serves a REST-ish JSON API; game state (puzzle, solution) lives in
  the Flask session, never sent to the client in plain form.
- Frontend: vanilla JS (no framework), CSS custom properties for theming, no
  inline styles.
- Every new backend function needs a corresponding pytest test in tests/.
- Prefer small, composable functions over long ones. No function over ~30 lines.
- Comments explain *why*, not *what*.
- Naming: snake_case (Python), camelCase (JS), kebab-case (CSS classes).