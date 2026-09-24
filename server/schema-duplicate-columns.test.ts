import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("canonical Drizzle schema", () => {
  it("does not map multiple properties to the same physical column in one table", () => {
    const schemaPath = resolve(process.cwd(), "drizzle/schema.ts");
    const source = readFileSync(schemaPath, "utf8");
    const tableRe =
      /export const\s+(\w+)\s*=\s*mysqlTable\("([^"]+)",\s*\{([\s\S]*?)\n\}\);/g;

    const duplicates: Array<{
      table: string;
      column: string;
      properties: string[];
    }> = [];

    for (const match of source.matchAll(tableRe)) {
      const [, , table, body] = match;
      const physical = new Map<string, string[]>();

      for (const line of body.split("\n")) {
        const column = line.match(/^\s*(\w+):\s*\w+\("([^"]+)"/);
        if (!column) continue;
        const [, property, physicalName] = column;
        const properties = physical.get(physicalName) ?? [];
        properties.push(property);
        physical.set(physicalName, properties);
      }

      for (const [column, properties] of physical) {
        if (properties.length > 1) {
          duplicates.push({ table, column, properties });
        }
      }
    }

    expect(duplicates).toEqual([]);
  });
});
