def resolve_canonical_head(head_counts: dict, lineage_lengths: dict):
    if not head_counts:
        return None
    max_count = max(head_counts.values())
    candidates = [h for h, c in head_counts.items() if c == max_count]
    if len(candidates) == 1:
        return candidates[0]
    max_lineage = max(lineage_lengths.get(h, 0) for h in candidates)
    candidates = [h for h in candidates if lineage_lengths.get(h, 0) == max_lineage]
    return sorted(candidates)[0]
