def confidence_from_heads(canonical_heads):
    heads = [h for h in canonical_heads if h]
    if not heads:
        return 0.0
    counts = {}
    for h in heads:
        counts[h] = counts.get(h, 0) + 1
    return max(counts.values()) / len(heads)
