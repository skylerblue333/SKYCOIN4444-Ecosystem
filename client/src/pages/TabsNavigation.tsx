import { useState } from "react";
import { Button } from "@/components/ui/button";

const TABS = ["Overview", "Activity", "Settings"] as const;

export default function TabsNavigation() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Tabs Navigation</h1>
        <p className="text-muted-foreground mb-8">Stable beta navigation component preview.</p>
        <div className="card p-6">
          <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Preview tabs">
            {TABS.map(tab => (
              <Button
                key={tab}
                type="button"
                variant={activeTab === tab ? "default" : "outline"}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
          <section role="tabpanel" className="rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">{activeTab}</h2>
            <p className="mt-2 text-muted-foreground">
              {activeTab === "Overview"
                ? "Use tabs to switch between related views without leaving the current screen."
                : activeTab === "Activity"
                  ? "Activity content is intentionally limited in the beta preview."
                  : "Settings content is intentionally limited in the beta preview."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
