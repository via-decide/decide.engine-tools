class GameTurnDAG:
    def __init__(self, game_state): self.game_state=game_state
    def export_to_continuity_graph(self):
        nodes={}
        for i,t in enumerate(self.game_state.turn_history):
            nid=f"game_turn_{i}_{t['turn_hash'][:12]}"
            nodes[nid]={"id":nid,"parent_ids":[f"game_turn_{i-1}_{self.game_state.turn_history[i-1]['turn_hash'][:12]}"] if i>0 else [],"deterministic_hash":t["turn_hash"]}
        return {"graph_type":"game_lineage","total_turns":len(self.game_state.turn_history),"nodes":nodes}
    def replay_to_turn(self, target_turn:int): return self.game_state.reconstruct_state_at_turn(target_turn)
