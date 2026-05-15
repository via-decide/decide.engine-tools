#!/usr/bin/env python3
from pathlib import Path
import json
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent.parent
req = [ROOT / 'AGENTS.md', ROOT / '.codex' / 'instructions.md', ROOT / '.codex' / 'session.md']
out = ROOT / 'bootstrap_recovery'; out.mkdir(exist_ok=True)
state = 'BOOTSTRAP_READY' if all(p.exists() for p in req) else ('BOOTSTRAP_PARTIAL' if any(p.exists() for p in req) else 'BOOTSTRAP_MISSING')
created = False
session = req[2]
if not session.exists():
    session.parent.mkdir(parents=True, exist_ok=True)
    session.write_text('# SESSION CONTINUITY\n\nsession_id: recovered-session\nworkspace: via-decide/decide.engine-tools\nauthority: local_operator\nbootstrap_epoch: 2026-05-15T00:00:00Z\ncontinuity_mode: deterministic_recovery\nactive_protocols: [bootstrap_validation]\nlineage_parent: missing_session\nruntime_constraints: [browser_only_static_stack]\n', encoding='utf-8')
    created, state = True, 'CONTINUITY_RECOVERED'
report = {'timestamp_utc': datetime.now(timezone.utc).isoformat(), 'initial_state': state, 'session_created': created, 'final_ready': all(p.exists() for p in req)}
(out / 'recovery-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
