from typing import Dict, List
from .game_state import GameAction, ImmutableGameState

class TurnScheduler:
    def __init__(self, game_state: ImmutableGameState): self.game_state=game_state
    def process_simultaneous_actions(self, actions_by_peer: Dict[str, List[GameAction]]) -> Dict:
        actions=[a for peer_actions in actions_by_peer.values() for a in peer_actions]
        ordered=sorted(actions,key=lambda a:(a.actor_id,a.action_type,a.timestamp_logical))
        return self.game_state.apply_turn(ordered)
