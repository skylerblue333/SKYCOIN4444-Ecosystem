import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function VoiceCloning() {
  return <EngineeringBetaWorkspace areaId="audio-voice" title="Voice Cloning" description="This voice cloning surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the voice cloning workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
