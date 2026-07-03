import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, TrendingUp, Cpu } from "lucide-react";

export default function MultiCryptoMine() {
  const [mining, setMining] = useState(false);
  const [hashrate, setHashrate] = useState(0);

  const cryptos = [
    { name: "Bitcoin", symbol: "BTC", reward: 0.0001 },
    { name: "Ethereum", symbol: "ETH", reward: 0.001 },
    { name: "Dogecoin", symbol: "DOGE", reward: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Multi-Crypto Mining</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-cyan-400" />
              <span className="text-slate-400">Hash Rate</span>
            </div>
            <p className="text-2xl font-bold text-white">{hashrate} MH/s</p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-slate-400">Daily Earnings</span>
            </div>
            <p className="text-2xl font-bold text-white">$12.45</p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-slate-400">Power Usage</span>
            </div>
            <p className="text-2xl font-bold text-white">850W</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cryptos.map((crypto) => (
            <Card key={crypto.symbol} className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{crypto.name}</h3>
              <p className="text-slate-400 mb-4">Reward: {crypto.reward} {crypto.symbol}</p>
              <Button
                onClick={() => setMining(!mining)}
                className={mining ? "w-full bg-red-600 hover:bg-red-700" : "w-full"}
              >
                {mining ? "Stop Mining" : "Start Mining"}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
