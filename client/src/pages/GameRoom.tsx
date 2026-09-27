import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function GameRoom() {
  return <EngineeringBetaWorkspace areaId="games-arcade" title="Game Room" description="This game room surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the game room workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
