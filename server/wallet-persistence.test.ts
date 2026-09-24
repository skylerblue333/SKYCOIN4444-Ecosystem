import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { and, eq, inArray, or } from "drizzle-orm";
import {
  tokenBalances,
  transactions,
  users,
  wallets,
} from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";
import {
  createWallet,
  db,
  ensureAllTokenBalances,
  getTransactions,
  getWalletByCurrency,
  getWallets,
} from "./db";
import { appRouter } from "./routers";

const user1 = "wallet-persistence-user-1";
const user2 = "wallet-persistence-user-2";
const ids = [user1, user2];

async function cleanup() {
  await db
    .delete(transactions)
    .where(
      or(
        inArray(transactions.userId, ids),
        inArray(transactions.toUserId, ids)
      )
    );
  await db.delete(wallets).where(inArray(wallets.userId, ids));
  await db.delete(tokenBalances).where(inArray(tokenBalances.userId, ids));
  await db.delete(users).where(inArray(users.id, ids));
}

beforeEach(async () => {
  await cleanup();
  await db.insert(users).values([
    {
      id: user1,
      openId: user1,
      email: "wallet-user-1@example.test",
      username: user1,
      name: "Wallet User One",
      loginMethod: "test",
    },
    {
      id: user2,
      openId: user2,
      email: "wallet-user-2@example.test",
      username: user2,
      name: "Wallet User Two",
      loginMethod: "test",
    },
  ]);
});

afterEach(cleanup);

async function callerFor(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("test user missing");
  const ctx = {
    user,
    req: { protocol: "https", headers: {} },
    res: { clearCookie() {} },
  } as unknown as TrpcContext;
  return appRouter.createCaller(ctx);
}

describe("wallet and financial beta truth", () => {
  it("initializes supported asset rows at zero and stays idempotent", async () => {
    await ensureAllTokenBalances(user1);
    await ensureAllTokenBalances(user1);

    const rows = await db
      .select()
      .from(tokenBalances)
      .where(eq(tokenBalances.userId, user1));

    expect(rows).toHaveLength(8);
    expect(rows.every(row => (row.balance ?? 0) === 0)).toBe(true);
    expect(rows.every(row => row.token === row.tokenSymbol)).toBe(true);
  });

  it("persists one wallet per user/currency and updates the stored address", async () => {
    const first = await createWallet(user1, "btc", "btc-address-one");
    const second = await createWallet(user1, "BTC", "btc-address-two");

    expect(first?.currency).toBe("BTC");
    expect(second?.address).toBe("btc-address-two");

    const list = await getWallets(user1);
    expect(list).toHaveLength(1);

    const btc = await getWalletByCurrency(user1, "btc");
    expect(btc?.address).toBe("btc-address-two");
    expect(btc?.balance ?? 0).toBe(0);
  });

  it("returns both incoming and outgoing persisted transaction history", async () => {
    await db.insert(transactions).values([
      {
        id: "wallet-history-outgoing",
        userId: user1,
        toUserId: user2,
        type: "transfer",
        amount: 2,
        status: "pending",
      },
      {
        id: "wallet-history-incoming",
        userId: user2,
        toUserId: user1,
        type: "transfer",
        amount: 3,
        status: "completed",
      },
    ]);

    const history = await getTransactions(user1);
    expect(history.map(row => row.id).sort()).toEqual([
      "wallet-history-incoming",
      "wallet-history-outgoing",
    ]);
  });

  it("refuses unconfigured wallet sends without inventing a tx hash", async () => {
    await createWallet(user1, "ETH", "eth-address");
    const caller = await callerFor(user1);

    const result = await caller.wallet.send({
      currency: "ETH",
      amount: 1,
      toAddress: "external-address",
    });

    expect(result).toEqual({
      success: false,
      status: "not_configured",
      reason: "external_transfer_not_configured",
      txHash: null,
    });

    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user1));
    expect(rows).toHaveLength(0);
  });

  it("refuses unconfigured transaction creation instead of marking it completed", async () => {
    const caller = await callerFor(user1);
    const result = await caller.transaction.create({
      type: "transfer",
      amount: 5,
      toUserId: user2,
    });

    expect(result).toEqual({
      success: false,
      status: "not_configured",
      reason: "financial_transfer_not_configured",
      transactionId: null,
    });

    const rows = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, user1),
          eq(transactions.toUserId, user2)
        )
      );
    expect(rows).toHaveLength(0);
  });
});
