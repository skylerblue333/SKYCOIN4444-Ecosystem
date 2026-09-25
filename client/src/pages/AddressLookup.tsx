import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AddressLookup() {
  return <EngineeringBetaWorkspace areaId="identity" title="Address lookup" description="Review identity and address lookup boundaries without implying verification or ownership from a lookup alone." actions={["Confirm the network and source before using a result.", "Treat lookup results as unverified until an approved identity flow passes.", "Do not expose private or sensitive address data in public logs."]} />;
}
