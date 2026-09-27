import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function PortfolioOptimization() {
  return <EngineeringBetaWorkspace areaId="trading" title="Portfolio Optimization" description="This portfolio optimization surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the portfolio optimization workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
