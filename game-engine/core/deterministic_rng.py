import hashlib

class DeterministicRNG:
    def __init__(self, seed: str): self.seed, self.state_counter = seed, 0
    def next_int(self, min_val: int, max_val: int) -> int:
        h = hashlib.sha256(f"{self.seed}:{self.state_counter}".encode()).hexdigest(); self.state_counter += 1
        return min_val + (int(h, 16) % (max_val - min_val))
    def next_float(self) -> float:
        h = hashlib.sha256(f"{self.seed}:{self.state_counter}".encode()).hexdigest(); self.state_counter += 1
        return (int(h, 16) % 10000) / 10000.0
    def branch(self, branch_name: str):
        return DeterministicRNG(hashlib.sha256(f"{self.seed}:{branch_name}".encode()).hexdigest())
