import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AudioEditing() {
  return <EngineeringBetaWorkspace areaId="audio-voice" title="Audio editing" description="Plan editing, export, and retention workflows without claiming durable media processing until provider evidence exists." actions={["Inspect source media and export requirements before editing.", "Keep original and derived assets clearly separated.", "Record retention and deletion expectations for every asset."]} />;
}
