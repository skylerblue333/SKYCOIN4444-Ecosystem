import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowRightLeft, TrendingUp } from "lucide-react";

export default function TokenSwap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const tokens = ["BTC", "ETH", "SOL", "DOGE", "SKY444"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Token Swap</h1>

        <Card className="bg-slate-900 border-slate-800 p-8">
          <div className="space-y-6">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">From</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1"
                />
                <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  {tokens.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button size="icon" variant="outline" className="rounded-full">
                <ArrowRightLeft className="w-5 h-5" />
              </Button>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">To</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="flex-1"
                />
                <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                  {tokens.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Info */}
            <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between">
              <span className="text-slate-400">Exchange Rate</span>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>1 BTC = 45,000 USD</span>
              </div>
            </div>

            {/* Swap Button */}
            <Button className="w-full" size="lg">
              Swap Tokens
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
