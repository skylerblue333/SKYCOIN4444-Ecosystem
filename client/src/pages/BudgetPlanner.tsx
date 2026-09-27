import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BudgetPlanner() {
  return <EngineeringBetaWorkspace areaId="commerce" title="Budget planner" description="Plan budgets with assumptions, approvals, variance tracking, and change history." actions={["Document assumptions and time horizon before planning.", "Separate estimates from committed spend.", "Require approval and audit evidence for material changes."]} />;
}
