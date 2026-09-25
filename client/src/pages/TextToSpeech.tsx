import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TextToSpeech() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Text To Speech" description="This text to speech surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the text to speech workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
