from core.deterministic_rng import DeterministicRNG
from scripts.simulate_gameplay import simulate_game

def test_identical_seed_identical_gameplay():
    assert simulate_game("seed_001",10)==simulate_game("seed_001",10)

def test_rng_determinism():
    r1,r2=DeterministicRNG("x"),DeterministicRNG("x")
    for _ in range(50): assert r1.next_int(0,100)==r2.next_int(0,100)
