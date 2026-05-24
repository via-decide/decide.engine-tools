#!/usr/bin/env python3
from core.game_state import ImmutableGameState, GameAction
from core.deterministic_rng import DeterministicRNG

def simulate_game(seed:str,num_turns:int=30)->str:
    game=ImmutableGameState(seed,seed); game.initialize_dungeon(); game.actors["player"]={"id":"player","x":10,"y":10,"hp":100,"is_alive":True}
    for t in range(num_turns):
        rng=DeterministicRNG(f"{seed}:turn_{t}")
        a=GameAction("player","move",{"dx":rng.next_int(-1,2),"dy":rng.next_int(-1,2)},t,t,"")
        game.apply_turn([a])
    return game.export_lineage_json()

if __name__=="__main__":
    l1=simulate_game("deterministic_test_001",20); l2=simulate_game("deterministic_test_001",20)
    print("[SUCCESS]" if l1==l2 else "[FAIL]")
