import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("live price feed integrity", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns only provider-supplied live prices", async () => {
    const providerPrices = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        current_price: 70000,
        price_change_percentage_24h: 1.25,
        market_cap: 1_400_000_000_000,
        total_volume: 30_000_000_000,
        image: "",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => providerPrices,
      })
    );

    const { fetchLivePrices } = await import("./price-feed");
    const prices = await fetchLivePrices();

    expect(prices).toEqual(providerPrices);
    expect(prices.some(price => price.id === "sky444")).toBe(false);
  });

  it("returns no invented quote when the provider is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("provider offline"))
    );

    const { fetchLivePrices } = await import("./price-feed");
    await expect(fetchLivePrices()).resolves.toEqual([]);
  });
});
