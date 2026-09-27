import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BulkOrdering() {
  return <EngineeringBetaWorkspace areaId="commerce" title="Bulk ordering" description="Plan bulk orders with inventory, approval, pricing, fulfillment, and cancellation controls." actions={["Confirm inventory and authorization before submitting an order.", "Review pricing, tax, shipping, and cancellation rules.", "Use test mode until provider and payment evidence is complete."]} />;
}
