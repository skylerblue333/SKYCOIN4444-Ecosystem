import { afterEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { streams, users } from "../drizzle/schema";
import {
  createPersistentStreamSession,
  db,
  endPersistentStreamSession,
  getPersistentStreamSession,
  listPersistentLiveStreams,
  markPersistentStreamLive,
} from "./db";

const userId = "stream-persistence-regression-user";

afterEach(async () => {
  await db.delete(streams).where(eq(streams.streamerId, userId));
  await db.delete(users).where(eq(users.id, userId));
});

describe("persistent stream session lifecycle", () => {
  it("stores stream ownership with the canonical string user id", async () => {
    await db.insert(users).values({
      id: userId,
      openId: userId,
      email: "stream-persistence@example.test",
      username: userId,
      name: "Stream Persistence",
      loginMethod: "test",
    });

    const created = await createPersistentStreamSession({
      creatorId: userId,
      title: "Persistent beta stream",
      description: "Metadata survives process-local memory loss",
      category: "Community",
    });

    expect(created).toMatchObject({
      creatorId: userId,
      title: "Persistent beta stream",
      status: "scheduled",
      viewerCount: 0,
      peakViewers: 0,
    });

    const reread = await getPersistentStreamSession(created!.id);
    expect(reread?.creatorId).toBe(userId);
  });

  it("refuses a live claim without playable shared media and persists a verified lifecycle once media exists", async () => {
    await db.insert(users).values({
      id: userId,
      openId: userId,
      email: "stream-media@example.test",
      username: userId,
      name: "Stream Media",
      loginMethod: "test",
    });

    const created = await createPersistentStreamSession({
      creatorId: userId,
      title: "Media-gated stream",
      category: "Technology",
    });

    await expect(
      markPersistentStreamLive(created!.id, userId)
    ).rejects.toThrow(/Shared media ingest is not configured/);

    await db
      .update(streams)
      .set({ hlsUrl: "https://media.example.test/live/playlist.m3u8" })
      .where(eq(streams.id, created!.id));

    const live = await markPersistentStreamLive(created!.id, userId);
    expect(live).toMatchObject({
      creatorId: userId,
      status: "live",
      hlsUrl: "https://media.example.test/live/playlist.m3u8",
    });

    const listed = await listPersistentLiveStreams("Technology", 20);
    expect(listed.some(stream => stream.id === created!.id)).toBe(true);

    const wrongOwner = await endPersistentStreamSession(
      created!.id,
      "someone-else"
    );
    expect(wrongOwner).toBeNull();

    const ended = await endPersistentStreamSession(created!.id, userId);
    expect(ended?.status).toBe("ended");

    const afterEnd = await listPersistentLiveStreams("Technology", 20);
    expect(afterEnd.some(stream => stream.id === created!.id)).toBe(false);
  });
});
