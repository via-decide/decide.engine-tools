#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent.parent
out = ROOT / 'bootstrap_diagnostics'; out.mkdir(exist_ok=True)
checks = [('AGENTS.md', (ROOT / 'AGENTS.md').exists()), ('instructions.md', (ROOT / '.codex' / 'instructions.md').exists()), ('session.md', (ROOT / '.codex' / 'session.md').exists())]
state = 'BOOTSTRAP_READY' if all(v for _, v in checks) else ('BOOTSTRAP_PARTIAL' if any(v for _, v in checks) else 'BOOTSTRAP_MISSING')
recovery = 'minimal session restored' if checks[2][1] else 'recovery required'
report = f"""[BOOTSTRAP]\nAGENTS.md {'✓' if checks[0][1] else '✗'}\ninstructions.md {'✓' if checks[1][1] else '✗'}\nsession.md {'✓' if checks[2][1] else '✗'}\n\n[STATE]\n{state}\n\n[RECOVERY]\n{recovery}\n\n[PIPELINE]\n{'execution unlocked' if state == 'BOOTSTRAP_READY' else 'execution blocked'}\n\n[TIMESTAMP]\n{datetime.now(timezone.utc).isoformat()}\n"""
(out / 'bootstrap-diagnostics.txt').write_text(report, encoding='utf-8')
print(report)
