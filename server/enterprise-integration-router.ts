import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc";
import {
  enterpriseIntegrationCatalog,
  getEnterpriseIntegrationHub,
} from "./enterprise-integration-hub";

const integrationIdSchema = z.enum([
  "valkey",
  "bullmq",
  "s3",
  "opensearch",
  "qdrant",
  "clickhouse",
  "prometheus",
  "opentelemetry",
  "fluentbit",
  "flagsmith",
  "keycloak",
  "kong",
]);

const jsonRecordSchema = z.record(z.string(), z.unknown());

export const enterpriseIntegrationRouter = router({
  catalog: adminProcedure.query(() => {
    const hub = getEnterpriseIntegrationHub();
    return {
      products: hub.catalog(),
      count: enterpriseIntegrationCatalog.length,
      boundary:
        "Optional engineering integrations. Configured/healthy does not imply production certification.",
    };
  }),

  health: adminProcedure
    .input(z.object({ id: integrationIdSchema }))
    .query(({ input }) => getEnterpriseIntegrationHub().health(input.id)),

  healthAll: adminProcedure.query(() =>
    getEnterpriseIntegrationHub().healthAll()
  ),

  cacheGet: adminProcedure
    .input(z.object({ key: z.string().min(1).max(128) }))
    .query(({ input }) => getEnterpriseIntegrationHub().cacheGet(input.key)),

  cacheSet: adminProcedure
    .input(
      z.object({
        key: z.string().min(1).max(128),
        value: z.string().max(1_000_000),
        ttlSeconds: z.number().int().min(1).max(86_400).default(300),
      })
    )
    .mutation(async ({ input }) => {
      await getEnterpriseIntegrationHub().cacheSet(
        input.key,
        input.value,
        input.ttlSeconds
      );
      return { success: true };
    }),

  cacheDelete: adminProcedure
    .input(z.object({ key: z.string().min(1).max(128) }))
    .mutation(async ({ input }) => ({
      deleted: await getEnterpriseIntegrationHub().cacheDelete(input.key),
    })),

  queueEnqueue: adminProcedure
    .input(
      z.object({
        queue: z.string().min(1).max(128),
        job: z.string().min(1).max(128),
        data: z.unknown(),
        idempotencyKey: z.string().min(1).max(512).optional(),
      })
    )
    .mutation(({ input }) =>
      getEnterpriseIntegrationHub().enqueue(
        input.queue,
        input.job,
        input.data,
        input.idempotencyKey
      )
    ),

  storagePutText: adminProcedure
    .input(
      z.object({
        key: z.string().min(1).max(512),
        body: z.string().max(5_000_000),
        contentType: z.string().min(3).max(128).default("text/plain"),
      })
    )
    .mutation(({ input }) =>
      getEnterpriseIntegrationHub().putObject(
        input.key,
        input.body,
        input.contentType
      )
    ),

  searchIndex: adminProcedure
    .input(
      z.object({
        index: z.string().min(1).max(128),
        id: z.string().min(1).max(128),
        document: jsonRecordSchema,
      })
    )
    .mutation(({ input }) =>
      getEnterpriseIntegrationHub().indexSearchDocument(
        input.index,
        input.id,
        input.document
      )
    ),

  searchQuery: adminProcedure
    .input(
      z.object({
        index: z.string().min(1).max(128),
        query: jsonRecordSchema,
        size: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(({ input }) =>
      getEnterpriseIntegrationHub().search(
        input.index,
        input.query,
        input.size
      )
    ),

  vectorUpsert: adminProcedure
    .input(
      z.object({
        points: z
          .array(
            z.object({
              id: z.union([z.string(), z.number()]),
              vector: z.array(z.number().finite()).min(1).max(8_192),
              payload: jsonRecordSchema.optional(),
            })
          )
          .min(1)
          .max(256),
      })
    )
    .mutation(({ input }) =>
      getEnterpriseIntegrationHub().upsertVectors(input.points)
    ),

  vectorQuery: adminProcedure
    .input(
      z.object({
        vector: z.array(z.number().finite()).min(1).max(8_192),
        limit: z.number().int().min(1).max(100).default(10),
      })
    )
    .query(({ input }) =>
      getEnterpriseIntegrationHub().queryVectors(input.vector, input.limit)
    ),

  analyticsSelect: adminProcedure
    .input(z.object({ query: z.string().min(1).max(20_000) }))
    .query(({ input }) =>
      getEnterpriseIntegrationHub().clickHouseSelect(input.query)
    ),

  metricRecord: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        value: z.number().finite(),
        kind: z.enum(["counter", "gauge"]).default("gauge"),
        mode: z.enum(["set", "add"]).default("set"),
        labels: z.record(z.string(), z.string().max(256)).default({}),
        help: z.string().max(512).optional(),
      })
    )
    .mutation(({ input }) => {
      getEnterpriseIntegrationHub().recordMetric(input.name, input.value, {
        kind: input.kind,
        mode: input.mode,
        labels: input.labels,
        help: input.help,
      });
      return { success: true };
    }),

  prometheus: adminProcedure.query(() => ({
    contentType: "text/plain; version=0.0.4",
    body: getEnterpriseIntegrationHub().renderPrometheus(),
  })),

  traceExport: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        durationMs: z.number().min(0).max(600_000),
        attributes: z
          .record(
            z.string(),
            z.union([z.string(), z.number().finite(), z.boolean()])
          )
          .default({}),
      })
    )
    .mutation(async ({ input }) => {
      await getEnterpriseIntegrationHub().exportSpan(
        input.name,
        input.durationMs,
        input.attributes
      );
      return { success: true };
    }),

  logPush: adminProcedure
    .input(
      z.object({
        level: z.enum(["debug", "info", "warn", "error"]),
        message: z.string().min(1).max(8_192),
        context: jsonRecordSchema.default({}),
      })
    )
    .mutation(async ({ input }) => {
      await getEnterpriseIntegrationHub().pushLog(
        input.level,
        input.message,
        input.context
      );
      return { success: true };
    }),

  featureFlag: adminProcedure
    .input(z.object({ name: z.string().min(1).max(128) }))
    .query(({ input }) =>
      getEnterpriseIntegrationHub().evaluateFlag(input.name)
    ),

  oidcDiscovery: adminProcedure.query(() =>
    getEnterpriseIntegrationHub().getKeycloakDiscovery()
  ),

  gatewayServices: adminProcedure
    .input(
      z
        .object({ limit: z.number().int().min(1).max(1_000).default(100) })
        .optional()
    )
    .query(({ input }) =>
      getEnterpriseIntegrationHub().listKongServices(input?.limit ?? 100)
    ),
});
