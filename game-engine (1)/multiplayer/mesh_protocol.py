class GameMeshProtocol:
    def __init__(self, peer_id, game_state): self.peer_id=peer_id; self.game_state=game_state; self.peers={}; self.pending_actions=[]
    def register_peer(self, peer_id): self.peers[peer_id]={"id":peer_id,"last_turn_hash":None,"is_synchronized":False}
    def broadcast_action(self, action_dict): self.pending_actions.append({"from_peer":self.peer_id,"action":action_dict})
    def sync_peers(self):
        actions=[m["action"] for m in self.pending_actions]; self.pending_actions=[]
        result=self.game_state.apply_turn(actions)
        return {"status":"synchronized","turn_executed":result["turn_number"],"turn_hash":result["turn_hash"]}
