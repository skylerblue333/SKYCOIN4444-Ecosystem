import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Brain, Database, ShieldCheck, Sparkles } from "lucide-react";

export default function DigitalTwin() {
  const profile = trpc.hopeAI.getPersonalityProfile.useQuery(undefined, {
    retry: false,
  });

  const data = profile.data;
  const configured = data?.configured === true;

  return (
    <div className="min-h-screen bg-black p-6 text-white md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Brain className="h-7 w-7 text-cyan-400" />
            <h1 className="text-4xl font-bold">Digital Twin</h1>
          </div>
          <p className="text-gray-400">
            A transparent preview of future persistent personality-memory tools.
          </p>
        </div>

        <Card className="border-cyan-500/20 bg-cyan-500/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="font-semibold text-cyan-100">
                Engineering-beta boundary
              </h2>
              <p className="mt-1 text-sm text-gray-300">
                This screen does not invent personality scores, relationship
                strength, future probabilities, achievements, or XP. Persistent
                HopeAI personality memory must be backed by the canonical storage
                contract before personalized twin insights are shown.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <StatusCard
            icon={Database}
            title="Persistent memory"
            status={
              profile.isLoading
                ? "checking"
                : configured
                  ? "configured"
                  : "not configured"
            }
          />
          <StatusCard
            icon={Sparkles}
            title="Personalized insights"
            status={configured ? "available from stored data" : "withheld"}
          />
          <StatusCard
            icon={Brain}
            title="Predictive scoring"
            status="not enabled"
          />
        </div>

        {profile.isError && (
          <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            The personality-memory capability could not be queried. No synthetic
            profile has been substituted.
          </Card>
        )}

        {!profile.isLoading && !configured && !profile.isError && (
          <Card className="border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-2 text-xl font-semibold">Preview state</h2>
            <p className="text-sm text-gray-400">
              The server reports{" "}
              <code className="text-cyan-300">
                {data?.reason ?? "hope_ai_chat_persistence_not_configured"}
              </code>
              . Once durable user-scoped memory is implemented and tested, this
              surface can derive explainable summaries from stored conversations
              instead of displaying hard-coded traits.
            </p>
          </Card>
        )}

        {configured && data && (
          <Card className="border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-xl font-semibold">Stored profile summary</h2>
              <Badge variant="outline">{data.totalMessages} messages</Badge>
            </div>
            <p className="text-sm text-gray-400">
              Personalized data is available from the configured persistence
              layer. Only stored, explainable values should be rendered here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  status,
}: {
  icon: typeof Brain;
  title: string;
  status: string;
}) {
  return (
    <Card className="border-gray-800 bg-gray-900 p-5">
      <Icon className="mb-3 h-5 w-5 text-cyan-400" />
      <p className="text-sm text-gray-400">{title}</p>
      <p className="mt-1 font-semibold">{status}</p>
    </Card>
  );
}
