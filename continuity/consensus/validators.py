def has_divergence(canonical_heads):
    return len(set([h for h in canonical_heads if h])) > 1
