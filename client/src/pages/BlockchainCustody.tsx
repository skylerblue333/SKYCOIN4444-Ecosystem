import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Copy,
  Database,
  Plus,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Link } from "wouter";

function truncateAddress(address: string) {
  if (address.length <= 18) return address;
  return `${address.slice(0, 10)}…${address.slice(-6)}`;
}

export default function BlockchainCustody() {
  const { user, isAuthenticated } = useAuth();
  const [currency, setCurrency] = useState("SKY444");
  const [address, setAddress] = useState("");
  const utils = trpc.useUtils();

  const walletsQuery = trpc.blockchain.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
  });

  const createMutation = trpc.blockchain.create.useMutation({
    onSuccess: async data => {
      if (!data.success || !data.wallet) {
        toast.error("Wallet record could not be created");
        return;
      }
      setAddress("");
      toast.success("Wallet record added");
      await utils.blockchain.list.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const wallets = walletsQuery.data ?? [];
  const totalStoredBalance = useMemo(
    () =>
      wallets.reduce(
        (sum, wallet) => sum + Number(wallet.balance ?? 0),
        0
      ),
    [wallets]
  );

  const createWallet = () => {
    const normalizedCurrency = currency.trim().toUpperCase();
    const normalizedAddress = address.trim();

    if (!normalizedCurrency) {
      toast.error("Enter a currency or network label");
      return;
    }
    if (!normalizedAddress) {
      toast.error("Enter a wallet address");
      return;
    }

    createMutation.mutate({
      currency: normalizedCurrency,
      address: normalizedAddress,
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 text-center">
          <Wallet className="h-12 w-12 text-amber-400" />
          <h1 className="text-2xl font-black">Wallet Registry</h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            Sign in to view wallet records associated with your beta account.
          </p>
          <Link href="/signin">
            <Button className="bg-amber-500 text-black hover:bg-amber-400">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <Link href="/wallet">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              aria-label="Back to wallet"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15">
            <Wallet className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold">Blockchain Wallet Registry</h1>
            <p className="text-xs text-zinc-500">
              Engineering-beta account records, not live custody
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="flex items-center gap-3 p-4">
              <Wallet className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-xl font-bold">{wallets.length}</p>
                <p className="text-xs text-zinc-500">Wallet records</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="flex items-center gap-3 p-4">
              <Database className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xl font-bold">
                  {totalStoredBalance.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">
                  Stored balance field total
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="flex items-center gap-3 p-4">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  User scoped
                </p>
                <p className="text-xs text-zinc-500">
                  Records are loaded for the signed-in account
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">
              External blockchain operations are not configured
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-300">
              This beta stores wallet address, currency, and balance fields in
              the application database. It does not claim private-key custody,
              HD derivation, address validation, gas estimation, transaction
              signing, blockchain broadcast, or confirmed on-chain balances.
              The server&apos;s external transfer path currently fails closed
              as not configured.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Registered wallets</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => void walletsQuery.refetch()}
                disabled={walletsQuery.isFetching}
                aria-label="Refresh wallet records"
                className="text-zinc-400 hover:text-white"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    walletsQuery.isFetching ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </CardHeader>
            <CardContent>
              {walletsQuery.isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(item => (
                    <Skeleton key={item} className="h-24 bg-zinc-800" />
                  ))}
                </div>
              ) : walletsQuery.error ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                  <p className="font-semibold text-red-200">
                    Wallet records could not be loaded
                  </p>
                  <p className="mt-1 text-sm text-red-200/70">
                    {walletsQuery.error.message}
                  </p>
                </div>
              ) : wallets.length === 0 ? (
                <div className="py-12 text-center">
                  <Wallet className="mx-auto mb-3 h-10 w-10 text-zinc-700" />
                  <p className="font-medium text-zinc-300">
                    No wallet records yet
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Add an address record using the form beside this list.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wallets.map(wallet => {
                    const walletAddress = wallet.address ?? "";
                    return (
                      <div
                        key={wallet.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-300">
                                {wallet.currency ?? "Unspecified"}
                              </span>
                              <span className="text-xs text-zinc-600">
                                record {wallet.id}
                              </span>
                            </div>
                            <p className="mt-2 break-all font-mono text-sm text-zinc-300">
                              {walletAddress || "No address stored"}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                            <div className="text-right">
                              <p className="font-bold">
                                {Number(wallet.balance ?? 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-zinc-600">
                                stored balance field
                              </p>
                            </div>
                            {walletAddress && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 bg-transparent text-zinc-300"
                                onClick={() => {
                                  void navigator.clipboard.writeText(
                                    walletAddress
                                  );
                                  toast.success("Address copied");
                                }}
                              >
                                <Copy className="mr-1.5 h-3.5 w-3.5" />
                                {truncateAddress(walletAddress)}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="text-base">Add wallet record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wallet-currency" className="text-zinc-300">
                  Currency / network label
                </Label>
                <Input
                  id="wallet-currency"
                  value={currency}
                  onChange={event => setCurrency(event.target.value)}
                  maxLength={32}
                  placeholder="SKY444"
                  className="mt-1.5 border-zinc-700 bg-zinc-950 text-white"
                />
              </div>
              <div>
                <Label htmlFor="wallet-address" className="text-zinc-300">
                  Public address
                </Label>
                <Input
                  id="wallet-address"
                  value={address}
                  onChange={event => setAddress(event.target.value)}
                  maxLength={255}
                  placeholder="Address supplied by the user"
                  className="mt-1.5 border-zinc-700 bg-zinc-950 font-mono text-white"
                />
              </div>
              <Button
                type="button"
                onClick={createWallet}
                disabled={createMutation.isPending}
                className="w-full bg-amber-500 font-semibold text-black hover:bg-amber-400"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createMutation.isPending ? "Adding…" : "Add wallet record"}
              </Button>
              <p className="text-xs leading-relaxed text-zinc-500">
                Adding a record does not create a blockchain wallet, generate a
                private key, validate ownership, or connect to a network.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
