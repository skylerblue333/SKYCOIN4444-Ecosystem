import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APIKeys() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="API keys" description="Review API key lifecycle and least-privilege boundaries without exposing secrets in the client." actions={["Create keys only for a defined integration scope.", "Rotate and revoke credentials through an auditable process.", "Never paste live secrets into tickets, logs, or source control."]} />;
}
