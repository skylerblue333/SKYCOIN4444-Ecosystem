import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { KeyRound, Loader2, Mail } from "lucide-react";

export function Signin() {
  const [formData, setFormData] = useState({
    email: "",
    accessKey: "",
  });

  const betaAccess = trpc.auth.betaAccess.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(current => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.accessKey) {
      toast.error("Enter your email and beta access key.");
      return;
    }

    try {
      await betaAccess.mutateAsync({
        email: formData.email,
        accessKey: formData.accessKey,
      });
      toast.success("Beta access granted.");
      window.location.assign("/");
    } catch {
      toast.error("Beta access was not accepted.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            SKYCOIN4444
          </div>
          <CardTitle className="text-xl text-white">Beta Access</CardTitle>
          <p className="text-sm text-slate-400">
            This beta is invite-only. Use the email and access key provided to you.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={betaAccess.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Beta access key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="password"
                  name="accessKey"
                  autoComplete="off"
                  placeholder="Enter your invite key"
                  value={formData.accessKey}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={betaAccess.isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={betaAccess.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {betaAccess.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking access...
                </>
              ) : (
                "Enter Beta"
              )}
            </Button>

            <p className="text-xs text-center text-slate-500">
              No demo password or mock login is accepted. Access is validated by the server.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signin;
