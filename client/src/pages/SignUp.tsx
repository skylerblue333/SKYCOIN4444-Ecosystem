import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export function SignUp() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Please fill all fields");
        setLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      const token = btoa(`${formData.email}:${formData.password}`);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_email", formData.email);
      localStorage.setItem("user_name", formData.name);

      toast.success("Account created! Welcome to SKYCOIN4444 🚀");
      setLocation("/");
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            SKYCOIN4444
          </div>
          <CardTitle className="text-xl text-white">Create Account</CardTitle>
          <p className="text-sm text-slate-400">
            Join the ecosystem and start earning
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Skyler Blue"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-slate-500">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setLocation("/signin")}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
            <p className="text-xs font-semibold text-slate-300">
              ✨ Get Started With:
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 bg-slate-800 rounded">
                <div className="font-bold text-purple-400">1,000</div>
                <div className="text-slate-500">SKY4</div>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <div className="font-bold text-yellow-400">500</div>
                <div className="text-slate-500">DOGE</div>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <div className="font-bold text-red-400">100</div>
                <div className="text-slate-500">TRUMP</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
