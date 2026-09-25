from pathlib import Path
import re

path = Path("client/src/data/ecosystemAreas.ts")
text = path.read_text()
if "maturityScore" not in text:
    text = text.replace(
        '  statusDescription: string;\n',
        '  statusDescription: string;\n  lifecycle: "engineering-beta";\n  maturityScore: number;\n  targetScore: 10;\n  nextGate: string;\n'
    )

score_by_status = {"verified": 6, "beta": 4, "planned": 2, "blocked": 1}
next_by_status = {
    "verified": "Production deployment evidence and independent security review",
    "beta": "Persistent customer action, automated tests, recovery behavior, and deployment evidence",
    "planned": "Working backend action with persistence and an integration owner",
    "blocked": "Required provider, authorization, settlement, or security dependency",
}
pattern = re.compile(
    r'  \{ id: "([^"]+)", label: "([^"]+)", description: "([^"]+)", status: "(verified|beta|planned|blocked)", statusDescription: "([^"]+)" \},'
)

def replace(match):
    area_id, label, description, status, status_desc = match.groups()
    score = score_by_status[status]
    next_gate = next_by_status[status]
    return (
        f'  {{ id: "{area_id}", label: "{label}", description: "{description}", '
        f'status: "{status}", statusDescription: "{status_desc}", lifecycle: "engineering-beta", '
        f'maturityScore: {score}, targetScore: 10, nextGate: "{next_gate}" }},'
    )

updated, count = pattern.subn(replace, text)
if count != 66:
    raise SystemExit(f"Expected 66 area records, updated {count}")
path.write_text(updated)
print(f"Scaled {count} areas into the engineering-beta lifecycle with evidence scores.")
