import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function OAuthProviders() {
  return <EngineeringBetaWorkspace areaId="access-security" title="OAuth Providers" description="This oauth providers surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the oauth providers workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
