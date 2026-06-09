import hashlib, json

class ModArtifactVerifier:
    def __init__(self): self.trusted_signers={}
    def register_signer(self, author_id, public_key): self.trusted_signers[author_id]=public_key
    def verify_mod(self, mod_artifact, signature, author_id):
        if author_id not in self.trusted_signers: return False
        if signature!=hashlib.sha256(json.dumps(mod_artifact,sort_keys=True).encode()).hexdigest(): return False
        forbidden=["exec","code","script","eval","api_call","network","file_io"]
        def has_bad(d):
            if isinstance(d,dict):
                for k,v in d.items():
                    if k in forbidden or has_bad(v): return True
            elif isinstance(d,list):
                for x in d:
                    if has_bad(x): return True
            return False
        return not has_bad(mod_artifact)
