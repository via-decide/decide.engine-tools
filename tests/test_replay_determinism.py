import pytest

from continuity.replay_graph import ReplayGraph
from continuity.replay_graph.graph import ReplayNode, compute_node_hash
from scripts.build_replay_consensus import DistributedReplaySimulator


def mk(id_, parents):
    intent, output = {"i": id_}, {"o": id_}
    return ReplayNode(id=id_, parent_ids=parents, intent=intent, output=output, timestamp=0.0, deterministic_hash=compute_node_hash(parents, intent, output))


def test_append_only_invariant():
    g = ReplayGraph(); n1 = mk("n1", [])
    g.append_node(n1)
    with pytest.raises(ValueError):
        g.append_node(n1)


def test_parent_integrity():
    g = ReplayGraph(); orphan = mk("orphan", ["nonexistent"])
    with pytest.raises(ValueError):
        g.append_node(orphan)


def test_lineage_reconstruction():
    g = ReplayGraph(); n1 = mk("n1", []); n2 = mk("n2", ["n1"]); n3 = mk("n3", ["n2"])
    g.append_node(n1); g.append_node(n2); g.append_node(n3)
    lineage = g.reconstruct_lineage("n3")
    assert [n.id for n in lineage] == ["n1", "n2", "n3"]


def test_fork_resolution_determinism():
    sim = DistributedReplaySimulator(num_nodes=3)
    sim.simulate_execution_round({"task": "a"}, [0, 0, 0])
    c1 = sim.generate_consensus_report()["canonical_head"]
    c2 = sim.generate_consensus_report()["canonical_head"]
    assert c1 == c2
