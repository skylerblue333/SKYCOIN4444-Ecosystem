import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileCheck,
  Lock,
  Shield,
  UserCheck,
} from "lucide-react";

type Capability = {
  title: string;
  status: "verified" | "not_configured";
  description: string;
  icon: typeof Shield;
};

const capabilities: Capability[] = [
  {
    title: "Authenticated application access",
    status: "verified",
    description:
      "The beta has authenticated application sessions and protected procedures. This does not constitute identity verification or KYC.",
    icon: UserCheck,
  },
  {
    title: "KYC / identity verification",
    status: "not_configured",
    description:
      "No live identity-verification provider, document review workflow, verification level, approval status, or KYC certification is wired to this page.",
    icon: FileCheck,
  },
  {
    title: "Consent management",
    status: "not_configured",
    description:
      "The canonical beta router does not currently expose a persisted consent ledger or consent-update workflow for this surface.",
    icon: Lock,
  },
  {
    title: "Automated data export / deletion requests",
    status: "not_configured",
    description:
      "There is no verified automated export, deletion queue, cancellation workflow, or guaranteed processing timeline exposed by the current beta API.",
    icon: Shield,
  },
  {
    title: "Compliance audit log",
    status: "not_configured",
    description:
      "No canonical compliance-event audit-log procedure is connected to this page. Operational/security logs must not be represented as regulatory audit evidence.",
    icon: BarChart3,
  },
];

export default function ComplianceCenter() {
  const configured = capabilities.filter(
    capability => capability.status === "verified"
  ).length;

  return (
    <div className="min-h-screen bg-[#07050f] px-4 py-6 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-start gap-3">
          <div className="rounded-xl bg-blue-900/30 p-2">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Compliance Center</h1>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              Engineering-beta capability status. This page does not represent
              regulatory approval, legal compliance certification, KYC/AML
              completion, or identity verification.
            </p>
          </div>
        </header>

        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-semibold text-amber-300">
                Compliance automation is not configured
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-300">
                The prior interface exposed KYC submission, compliance scoring,
                consent toggles, data-export/deletion requests, and audit events
                even though those procedures are absent from the canonical
                router. Those controls have been removed rather than simulated.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Verified on this surface
              </p>
              <p className="mt-1 text-3xl font-black text-green-400">
                {configured}/{capabilities.length}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Status count reflects implemented application contracts only.
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Regulatory status
              </p>
              <p className="mt-1 text-lg font-bold text-amber-300">
                Not asserted
              </p>
              <p className="mt-1 text-xs text-gray-500">
                No approval, certification, provider integration, or legal
                conclusion is inferred from application code.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Capability matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {capabilities.map(capability => {
              const Icon = capability.icon;
              const verified = capability.status === "verified";

              return (
                <div
                  key={capability.title}
                  className="rounded-xl border border-gray-800 bg-gray-950/50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        verified ? "bg-green-500/10" : "bg-gray-800"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          verified ? "text-green-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-white">
                          {capability.title}
                        </h2>
                        <Badge
                          className={
                            verified
                              ? "border-green-500/30 bg-green-500/10 text-green-300"
                              : "border-gray-700 bg-gray-800 text-gray-300"
                          }
                        >
                          {verified ? "Verified beta contract" : "Not configured"}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-blue-200">
              <CheckCircle2 className="h-5 w-5" />
              What must exist before these features can be called operational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed text-gray-300">
              <li>
                • A selected and configured identity/KYC provider with tested
                failure handling and truthful provider-specific limitations.
              </li>
              <li>
                • Persisted consent records with versioning, timestamps,
                authenticated ownership boundaries, and tests.
              </li>
              <li>
                • Defined data-access/deletion workflows with authorization,
                auditability, retention rules, and verified execution.
              </li>
              <li>
                • A real audit-event model and operational controls that are
                tested before any regulatory or certification claims are made.
              </li>
              <li>
                • Legal review appropriate to the jurisdictions, products, and
                data actually used by a deployed service.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
