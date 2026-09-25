import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ChatHistory() {
  return <EngineeringBetaWorkspace areaId="messaging" title="Chat history" description="Review conversation history with ownership, search, retention, export, and deletion boundaries." actions={["Confirm participants and visibility before opening a thread.", "Treat exports and search results as sensitive user data.", "Apply retention and deletion policy consistently."]} />;
}
