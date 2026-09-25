import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ChatBot() {
  return <EngineeringBetaWorkspace areaId="ai-assistants" title="Chat assistant" description="Explore assistant conversations with source visibility, safety controls, and human escalation." actions={["Check citations or source context before relying on an answer.", "Avoid entering secrets or sensitive personal data.", "Escalate high-impact decisions to an accountable human reviewer."]} />;
}
