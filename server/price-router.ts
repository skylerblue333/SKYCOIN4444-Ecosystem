import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  fetchLivePrices,
  fetchExtendedPrices,
  fetchOHLCV,
  fetchTokenPrice,
} from "./price-feed";

export const pricesRouter = router({
  list: publicProcedure.query(async () => {
    return fetchLivePrices();
  }),
  extended: publicProcedure.query(async () => {
    return fetchExtendedPrices();
  }),
  get: publicProcedure
    .input(z.object({ coinId: z.string() }))
    .query(async ({ input }) => {
      return fetchTokenPrice(input.coinId);
    }),
  ohlcv: publicProcedure
    .input(z.object({ coinId: z.string(), days: z.number().optional() }))
    .query(async ({ input }) => {
      return fetchOHLCV(input.coinId, input.days);
    }),
});
