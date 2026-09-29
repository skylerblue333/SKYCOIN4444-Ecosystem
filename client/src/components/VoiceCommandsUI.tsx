/**
 * Voice navigation beta.
 *
 * Browser speech recognition is used only to capture text when supported.
 * Command execution is intentionally limited to a small, explicit set of
 * client-side navigation actions; there is no claim of a 444-command server
 * registry or privileged command execution.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const COMMANDS = [
  { phrase: "go home", label: "Home", route: "/" },
  { phrase: "dashboard", label: "Dashboard", route: "/dashboard" },
  { phrase: "ai chat", label: "HopeAI", route: "/hopeai" },
  { phrase: "create post", label: "Social feed", route: "/social" },
  { phrase: "play game", label: "Gaming", route: "/games" },
  { phrase: "marketplace", label: "Marketplace", route: "/marketplace" },
  { phrase: "wallet", label: "Wallet", route: "/wallet" },
  { phrase: "learn", label: "SkySchool", route: "/skyschool" },
] as const;

type CommandResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export function VoiceCommandsUI() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<CommandResult | null>(null);

  const executeNavigationCommand = (rawCommand = input) => {
    const normalized = rawCommand.trim().toLowerCase();
    if (!normalized) return;

    const command = COMMANDS.find(
      item =>
        normalized === item.phrase ||
        normalized === item.label.toLowerCase() ||
        normalized.includes(item.phrase)
    );

    if (!command) {
      setResult({
        ok: false,
        message:
          "Command not recognized. Only the navigation commands shown below are enabled in this beta.",
      });
      return;
    }

    setResult({ ok: true, message: `Opening ${command.label}` });
    navigate(command.route);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setResult({
        ok: false,
        message: "Browser speech recognition is not available on this device.",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = String(event.results?.[0]?.[0]?.transcript ?? "").trim();
      setInput(transcript);
      executeNavigationCommand(transcript);
    };
    recognition.onerror = (event: any) => {
      setResult({
        ok: false,
        message: `Voice recognition error: ${String(event.error ?? "unknown")}`,
      });
    };

    recognition.start();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gold">Voice Navigation Beta</h1>
        <p className="text-sm text-muted-foreground">
          {COMMANDS.length} verified client-side navigation commands are enabled.
          Server-side command automation is not configured.
        </p>
      </div>

      <Card className="bg-black/50 border-gold/30 p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gold">Command Input</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter") executeNavigationCommand();
              }}
              placeholder='Try "go home", "wallet", or "ai chat"'
              className="bg-black/30 border-gold/30 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={() => executeNavigationCommand()}
              className="bg-gold hover:bg-gold/90 text-black font-bold"
            >
              Navigate
            </Button>
            <Button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={isListening ? "bg-red-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}
            >
              {isListening ? "🎤 Listening..." : "🎤 Voice"}
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.ok
                  ? "bg-green-900/30 border-green-500"
                  : "bg-amber-900/30 border-amber-500"
              }`}
            >
              <p className="text-white text-sm">{result.message}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-black/50 border-gold/30 p-6">
        <h2 className="text-2xl font-bold text-gold mb-4">
          Available Commands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMANDS.map(command => (
            <button
              key={command.phrase}
              onClick={() => {
                setInput(command.phrase);
                executeNavigationCommand(command.phrase);
              }}
              className="p-3 bg-black/30 border border-gold/30 text-gold rounded hover:bg-gold/20 transition font-bold text-sm"
            >
              {command.phrase}
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-black/50 border-gold/30 p-6">
        <h2 className="text-xl font-bold text-gold mb-2">Beta boundary</h2>
        <p className="text-sm text-gray-300">
          Speech recognition is provided by the browser when available. These
          commands only navigate to known SKYCOIN4444 screens; they do not send
          payments, modify accounts, run admin actions, or invoke a hidden
          automation service.
        </p>
      </Card>
    </div>
  );
}
