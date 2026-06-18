#!/usr/bin/env node

/**
 * Zayvora pipeline scaffolder.
 *
 * This utility coordinates creation of the first Highway-V2I integration pipeline
 * across multiple repositories under a shared base directory.
 */

const fs = require('fs');
const path = require('path');

function ensureDir(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function writeIfMissing(targetFile, content, options = {}) {
  const { overwrite = false } = options;
  if (!overwrite && fs.existsSync(targetFile)) return false;
  fs.writeFileSync(targetFile, content, 'utf8');
  return true;
}

function getRepoBlueprints() {
  return {
    'zayvora-sim-lab': {
      files: {
        'simulations/corridor_simulation.py': `"""Corridor traffic simulation stream generator."""

from __future__ import annotations

import json
import random
from dataclasses import dataclass, asdict
from typing import Generator, Iterable

CORRIDOR_LENGTH_METERS = 1000.0


@dataclass
class VehicleState:
    """Represents one vehicle state emitted by the simulation."""

    vehicle_id: str
    speed: float
    lane: int
    position: float
    acceleration: float


def generate_vehicle_states(num_vehicles: int = 10, seed: int = 42) -> Iterable[VehicleState]:
    """Generate deterministic vehicle states for a 1km corridor."""

    rng = random.Random(seed)
    for index in range(num_vehicles):
      speed = round(rng.uniform(60.0, 120.0), 2)
      acceleration = round(rng.uniform(-2.5, 2.0), 2)
      position = round(rng.uniform(0, CORRIDOR_LENGTH_METERS), 2)
      lane = rng.randint(1, 3)
      yield VehicleState(
          vehicle_id=f"car_{index + 1:03d}",
          speed=speed,
          lane=lane,
          position=position,
          acceleration=acceleration,
      )


def json_stream(num_vehicles: int = 10, seed: int = 42) -> Generator[str, None, None]:
    """Yield newline-delimited JSON states for downstream pipeline modules."""

    for state in generate_vehicle_states(num_vehicles=num_vehicles, seed=seed):
      yield json.dumps(asdict(state))


if __name__ == "__main__":
    for item in json_stream(num_vehicles=5):
        print(item)
`,
        'run_demo_pipeline.py': `"""Demo script for the first cross-repo Highway-V2I pipeline run.

The script imports modules from neighboring repositories when they are checked out
as sibling directories on disk.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
for repo in [
    "zayvora-sensor-net",
    "zayvora-protocol-lab",
    "zayvora-infrastructure-ai",
    "zayvora-highway-v2i",
]:
    sys.path.append(str(ROOT / repo))

from simulations.corridor_simulation import json_stream
from communication.corridor_receiver import detect_vehicle_events
from protocol.v2i_message_router import route_sensor_events
from algorithms.traffic_optimizer import analyze_traffic
from backend.pipeline_connector import PipelineConnector


def run_demo() -> None:
    """Run simulation -> sensor -> protocol -> AI -> dashboard flow."""

    vehicle_states = [json.loads(item) for item in json_stream(num_vehicles=12, seed=7)]
    sensor_events = detect_vehicle_events(vehicle_states)
    routed_messages = route_sensor_events(sensor_events)
    metrics = analyze_traffic(vehicle_states)
    connector = PipelineConnector()
    result = connector.update(vehicle_states=vehicle_states, sensor_events=sensor_events, ai_metrics=metrics)

    print(json.dumps({
        "vehicles": len(vehicle_states),
        "events": len(sensor_events),
        "messages": len(routed_messages),
        "dashboard_state": result,
    }, indent=2))


if __name__ == "__main__":
    run_demo()
`,
        'README.md': `# Zayvora Sim Lab

Traffic simulation architecture for highway corridor experiments.

## Folder Explanation
- \`simulations/\`: corridor and traffic model generators.
- \`visualization/\`: adapters that feed dashboards.
- \`data/\`: sample corridor and scenario fixtures.

## Architecture Overview
The simulation lab emits vehicle states for the pipeline:
Simulation -> Sensor Network -> Protocol -> Infrastructure AI -> Dashboard.

## Development Roadmap
1. Add lane-changing behavior and incident events.
2. Add replayable benchmark scenarios.
3. Add calibration against real corridor traces.
`,
      }
    },
    'zayvora-sensor-net': {
      files: {
        'communication/corridor_receiver.py': `"""Receive simulated corridor stream and emulate RSU detections."""

from __future__ import annotations

from typing import Dict, List

RSU_COUNT = 5


def _nearest_rsu(position: float) -> str:
    slot = int((position / 1000.0) * RSU_COUNT)
    slot = max(0, min(RSU_COUNT - 1, slot))
    return f"rsu_{slot + 1:02d}"


def detect_vehicle_events(vehicle_states: List[Dict]) -> List[Dict]:
    """Convert vehicle states into RSU detection events."""

    events = []
    for state in vehicle_states:
        speed = float(state.get("speed", 0))
        signal_strength = round(-75 + min(20, speed / 8.0), 2)
        events.append({
            "rsu_id": _nearest_rsu(float(state.get("position", 0))),
            "vehicle_id": state.get("vehicle_id", "unknown"),
            "signal_strength": signal_strength,
        })
    return events


if __name__ == "__main__":
    sample = [{"vehicle_id": "car_001", "speed": 102, "position": 345, "lane": 2}]
    print(detect_vehicle_events(sample))
`,
        'README.md': `# Zayvora Sensor Net

RSU and IoT infrastructure simulation for roadside detection research.

## Folder Explanation
- \`rsu/\`: roadside unit node behavior.
- \`iot/\`: sensor-level simulation modules.
- \`communication/\`: handshake and signal transport logic.

## Architecture Overview
Consumes simulated vehicle telemetry and emits RSU-level events consumed by protocol research modules.

## Development Roadmap
1. Add packet-loss simulation.
2. Add weather-sensitive signal attenuation.
3. Add multi-hop relay tests.
`,
      }
    },
    'zayvora-protocol-lab': {
      files: {
        'protocol/v2i_message_router.py': `"""Route RSU events into validated V2I protocol messages."""

from __future__ import annotations

from typing import Dict, List


REQUIRED_EVENT_KEYS = {"rsu_id", "vehicle_id", "signal_strength"}


def validate_event(event: Dict) -> None:
    """Validate minimum event schema before routing."""

    missing = REQUIRED_EVENT_KEYS.difference(event.keys())
    if missing:
        raise ValueError(f"Missing required keys: {sorted(missing)}")


def route_sensor_events(events: List[Dict]) -> List[Dict]:
    """Convert sensor events into protocol-layer vehicle updates."""

    messages = []
    for event in events:
        validate_event(event)
        latency = max(5, int(30 + float(event["signal_strength"])))
        messages.append({
            "type": "vehicle_update",
            "vehicle_id": event["vehicle_id"],
            "rsu": event["rsu_id"],
            "latency": latency,
        })
    return messages


if __name__ == "__main__":
    print(route_sensor_events([
        {"rsu_id": "rsu_03", "vehicle_id": "car_001", "signal_strength": -63}
    ]))
`,
        'README.md': `# Zayvora Protocol Lab

Experimental vehicle-to-infrastructure protocol research workspace.

## Folder Explanation
- \`protocol/\`: protocol framing and routers.
- \`spec/\`: protocol specifications and drafts.
- \`tests/\`: validation and interoperability checks.

## Architecture Overview
Transforms RSU detections into validated protocol messages that downstream infrastructure AI can consume.

## Development Roadmap
1. Add schema versioning.
2. Add signed-message integrity checks.
3. Add stress tests for latency profiles.
`,
      }
    },
    'zayvora-infrastructure-ai': {
      files: {
        'algorithms/traffic_optimizer.py': `"""Traffic optimization model for the Highway-V2I pipeline."""

from __future__ import annotations

from typing import Dict, List

CORRIDOR_LENGTH_KM = 1.0


def analyze_traffic(vehicle_states: List[Dict]) -> Dict:
    """Compute density, congestion risk score, and recommended speed."""

    vehicle_count = len(vehicle_states)
    traffic_density = round(vehicle_count / CORRIDOR_LENGTH_KM, 2)
    avg_speed = sum(float(v.get("speed", 0)) for v in vehicle_states) / max(1, vehicle_count)
    risk_score = round(min(1.0, (traffic_density / 80.0) + max(0.0, (70.0 - avg_speed) / 120.0)), 3)
    recommended_speed = round(max(45.0, 95.0 - risk_score * 35.0), 2)
    return {
        "traffic_density": traffic_density,
        "risk_score": risk_score,
        "recommended_speed": recommended_speed,
    }


if __name__ == "__main__":
    sample = [{"speed": 88}, {"speed": 76}, {"speed": 92}]
    print(analyze_traffic(sample))
`,
        'README.md': `# Zayvora Infrastructure AI

AI optimization layer for intelligent infrastructure operations.

## Folder Explanation
- \`algorithms/\`: optimization and prediction modules.
- \`models/\`: model artifacts and checkpoints.
- \`simulation/\`: AI-specific simulation adapters.

## Architecture Overview
Consumes protocol-layer traffic messages and computes risk metrics plus control recommendations.

## Development Roadmap
1. Add per-lane congestion classification.
2. Add incident forecasting features.
3. Add RL-driven speed harmonization.
`,
      }
    },
    'zayvora-highway-v2i': {
      files: {
        'backend/pipeline_connector.py': `"""Dashboard pipeline connector for cross-repository integration."""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Dict, List


@dataclass
class DashboardState:
    vehicle_count: int
    event_count: int
    risk_score: float
    recommended_speed: float


class PipelineConnector:
    """Aggregates pipeline payloads into a dashboard-ready summary."""

    def update(self, vehicle_states: List[Dict], sensor_events: List[Dict], ai_metrics: Dict) -> Dict:
        state = DashboardState(
            vehicle_count=len(vehicle_states),
            event_count=len(sensor_events),
            risk_score=float(ai_metrics.get("risk_score", 0.0)),
            recommended_speed=float(ai_metrics.get("recommended_speed", 0.0)),
        )
        return asdict(state)


if __name__ == "__main__":
    connector = PipelineConnector()
    print(connector.update([], [], {"risk_score": 0.15, "recommended_speed": 88.5}))
`,
        'README.md': `# Zayvora Highway V2I

Highway V2I infrastructure simulation dashboard system.

## Folder Explanation
- \`dashboard/\`: browser-based simulation UI.
- \`ui/\`: map and visualization logic.
- \`backend/\`: integration and pipeline connectors.
- \`docs/\`: architecture and design docs.

## Architecture Overview
Receives traffic, sensor, protocol, and AI outputs to render operator-facing corridor status.

## Development Roadmap
1. Add live map overlays for RSU detections.
2. Add scenario playback controls.
3. Add decision recommendation timeline.
`,
      }
    },
  };
}

function scaffold(baseDir, options = {}) {
  const { overwrite = false } = options;
  const blueprints = getRepoBlueprints();
  const results = [];

  Object.entries(blueprints).forEach(([repoName, repoConfig]) => {
    const repoRoot = path.join(baseDir, repoName);
    Object.entries(repoConfig.files).forEach(([relativeFile, content]) => {
      const absoluteFile = path.join(repoRoot, relativeFile);
      ensureDir(path.dirname(absoluteFile));
      const changed = writeIfMissing(absoluteFile, content, { overwrite });
      results.push({ repo: repoName, file: relativeFile, changed });
    });
  });

  return results;
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    overwrite: args.has('--overwrite'),
    dryRun: args.has('--dry-run'),
    baseDir: process.env.ZAYVORA_BASE_DIR || process.cwd(),
  };
}

function runCli() {
  const options = parseArgs(process.argv);
  const planned = scaffold(options.baseDir, { overwrite: options.overwrite });

  if (options.dryRun) {
    planned.forEach((item) => {
      const status = item.changed ? 'would_write' : 'skip_existing';
      console.log(`${status}: ${item.repo}/${item.file}`);
    });
    return;
  }

  const wrote = planned.filter((item) => item.changed).length;
  const skipped = planned.length - wrote;
  planned.forEach((item) => {
    const status = item.changed ? 'wrote' : 'skipped';
    console.log(`${status}: ${item.repo}/${item.file}`);
  });
  console.log(`\nScaffold summary: wrote=${wrote}, skipped=${skipped}`);
}

if (require.main === module) {
  runCli();
}

module.exports = {
  getRepoBlueprints,
  scaffold,
  parseArgs,
};
