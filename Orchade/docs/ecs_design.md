# ECS Design

`engine/core/ecs.py` defines:
- `Entity` as stable integer IDs.
- `Component` as typed data buckets.
- `System` as update processors.
- `World` as registry for entities/components/systems.

`World.update(delta)` runs all registered systems. Systems query entities by component signatures using `entities_with(...)`.
