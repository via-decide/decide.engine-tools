"""Runtime combat system for NPC and faction skirmishes."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List

from combat.damage_calculator import DamageCalculator
from combat.weapon_system import WeaponSystem


@dataclass
class CombatSystem:
    weapon_system: WeaponSystem = field(default_factory=WeaponSystem)
    damage_calculator: DamageCalculator = field(default_factory=DamageCalculator)

    def resolve(self, npc_actions: List[Dict[str, Any]], npc_registry: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
        events: List[Dict[str, Any]] = []
        combatants = [entry for entry in npc_actions if entry.get("action") in {"retaliate", "seek_cover"}]

        for idx in range(0, len(combatants), 2):
            if idx + 1 >= len(combatants):
                break

            attacker = combatants[idx]
            defender = combatants[idx + 1]
            attacker_data = npc_registry.get(attacker["npc_id"], {})
            defender_data = npc_registry.get(defender["npc_id"], {})

            attack_skill = int(attacker_data.get("skills", {}).get("combat", 4))
            defense_skill = int(defender_data.get("skills", {}).get("survival", 4))
            weapon_profile = self.weapon_system.profile(attacker_data.get("weapon", "unarmed"))
            damage = self.damage_calculator.calculate(attack_skill, defense_skill, weapon_profile["power"])

            events.append(
                {
                    "attacker": attacker["npc_id"],
                    "defender": defender["npc_id"],
                    "damage": damage,
                    "weapon": attacker_data.get("weapon", "unarmed"),
                }
            )

        return events
