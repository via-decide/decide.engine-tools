from dataclasses import dataclass
from typing import Any, Dict, List
import hashlib, json

@dataclass(frozen=True)
class GameAction:
    actor_id: str; action_type: str; parameters: Dict[str, Any]; turn_number: int; timestamp_logical: int; action_hash: str

class ImmutableGameState:
    def __init__(self, initial_seed: str, dungeon_seed: str):
        self.turn_history=[]; self.current_turn=0; self.initial_seed=initial_seed; self.dungeon_seed=dungeon_seed; self.actors={}; self.dungeon=[]; self.committed_turn_hash=None
    def initialize_dungeon(self, width=40, height=20):
        self.dungeon=[[1 if x in (0,width-1) or y in (0,height-1) else 0 for x in range(width)] for y in range(height)]
    def apply_turn(self, actions: List[GameAction]) -> Dict:
        ordered=sorted(actions,key=lambda a:(a.actor_id,a.action_type,a.timestamp_logical)); new=self._simulate_actions(ordered)
        turn_data={"turn":self.current_turn,"actions":[{"actor":a.actor_id,"type":a.action_type,"parameters":a.parameters} for a in ordered],"state":new}
        turn_hash=hashlib.sha256(json.dumps(turn_data,sort_keys=True).encode()).hexdigest()
        self.turn_history.append({"turn_number":self.current_turn,"actions":ordered,"state_snapshot":new,"turn_hash":turn_hash,"parent_turn_hash":self.committed_turn_hash})
        self.committed_turn_hash=turn_hash; self.current_turn+=1; self.actors=new["actors"]
        return {"turn_number":self.current_turn-1,"turn_hash":turn_hash,"state_snapshot":new}
    def reconstruct_state_at_turn(self, turn_number: int) -> Dict: return self.turn_history[turn_number]["state_snapshot"]
    def export_lineage_json(self) -> str:
        return json.dumps({"game_seed":self.initial_seed,"dungeon_seed":self.dungeon_seed,"total_turns":len(self.turn_history),"turns":[{"turn_number":t["turn_number"],"turn_hash":t["turn_hash"],"parent_turn_hash":t.get("parent_turn_hash")} for t in self.turn_history]},indent=2)
    def _simulate_actions(self, actions):
        new={k:v.copy() for k,v in self.actors.items()}
        for a in actions:
            if a.actor_id not in new: continue
            if a.action_type=="move":
                dx,dy=a.parameters.get("dx",0),a.parameters.get("dy",0); nx,ny=new[a.actor_id]["x"]+dx,new[a.actor_id]["y"]+dy
                if 0<=ny<len(self.dungeon) and 0<=nx<len(self.dungeon[0]) and self.dungeon[ny][nx]==0: new[a.actor_id]["x"],new[a.actor_id]["y"]=nx,ny
        return {"actors":new,"turn_number":self.current_turn,"timestamp":None}
