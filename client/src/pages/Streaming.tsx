import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Play, Eye, Heart, MessageCircle, Send, Gift } from "lucide-react";

export default function Streaming() {
  const [tab, setTab] = useState<"live" | "vod" | "clips" | "schedule">("live");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Live Streaming</h1>
        
        <div className="flex gap-4 mb-8">
          {(["live", "vod", "clips", "schedule"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              onClick={() => setTab(t)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-900 rounded-lg overflow-hidden hover:ring-2 ring-purple-500 transition-all cursor-pointer">
              <div className="relative aspect-video bg-slate-800 flex items-center justify-center">
                <Radio className="w-12 h-12 text-purple-500/40" />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-500">LIVE</Badge>
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2">Stream Title {i}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                  <Eye className="w-4 h-4" />
                  <span>1,234 viewers</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-1" /> Follow
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Gift className="w-4 h-4 mr-1" /> Donate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
