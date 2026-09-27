import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AdvancedOrders() {
  return <EngineeringBetaWorkspace areaId="trading" title="Advanced orders" description="Plan order conditions and risk controls without enabling unsupported trading or execution claims." actions={["Define order conditions and cancellation behavior first.", "Use test or paper workflows until execution is verified.", "Review fees, slippage, custody, and failure handling before any live action."]} />;
}
