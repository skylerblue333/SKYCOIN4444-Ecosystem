import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APITesting() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="API testing" description="Design contract, authorization, failure, and load tests before integrating an API." actions={["Test invalid inputs and unauthorized requests.", "Record latency, retry, and rate-limit behavior.", "Use non-production credentials and data in test runs."]} />;
}
