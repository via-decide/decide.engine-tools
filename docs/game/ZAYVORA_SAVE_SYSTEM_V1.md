"""
ZAYVORA_SAVE_SYSTEM_V1.py - Game state persistence using Zayvora's capabilities
"""

import json
import sqlite3
from typing import Dict, Any

class GameStatePersistence:
    def __init__(self):
        self.game_state_file = "game_state.json"
        self.database_name = "game_state.db"

    def store_game_state(self, game_state: Dict[str, Any]) -> None:
        try:
            with open(self.game_state_file, 'w') as f:
                json.dump(game_state, f)
        except Exception as e:
            print(f"Error storing game state: {e}")

    def load_game_state(self) -> Dict[str, Any]:
        try:
            with open(self.game_state_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
        except Exception as e:
            print(f"Error loading game state: {e}")
            return {}

    def store_game_state_db(self, game_state: Dict[str, Any]) -> None:
        try:
            conn = sqlite3.connect(self.database_name)
            c = conn.cursor()
            for key, value in game_state.items():
                c.execute("INSERT INTO game_state VALUES (?, ?)", (key, json.dumps(value)))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error storing game state to database: {e}")

    def load_game_state_db(self) -> Dict[str, Any]:
        try:
            conn = sqlite3.connect(self.database_name)
            c = conn.cursor()
            c.execute("SELECT * FROM game_state")
            rows = c.fetchall()
            game_state = {}
            for row in rows:
                key = row[0]
                value = json.loads(row[1])
                game_state[key] = value
            conn.close()
            return game_state
        except Exception as e:
            print(f"Error loading game state from database: {e}")
            return {}

if __name__ == "__main__":
    persistence = GameStatePersistence()
    # Example usage:
    game_state = {"player_position": (10, 20), "score": 100}
    persistence.store_game_state(game_state)
    loaded_game_state = persistence.load_game_state()
    print(loaded_game_state)