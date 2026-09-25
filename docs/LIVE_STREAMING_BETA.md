# Live Streaming Beta Contract

This document describes the verified SKYCOIN4444 live-streaming boundary as of
2026-09-25.

## Persisted capability

Stream session metadata is stored in the canonical MySQL `streams` table.
Creator ownership uses the canonical string user ID; the live router no longer
converts user IDs with `Number(...)`.

Persisted fields include the session ID, creator ID, title, description,
category, state, viewer counters, HLS URL, archive/thumbnail URLs, and lifecycle
timestamps supported by the existing schema.

A session begins as `scheduled`. It is returned by public live discovery only
after it becomes `live`.

## Shared-media gate

Browser camera/microphone preview is local device functionality. It is **not**
evidence that other users can watch the stream.

The server therefore refuses to mark a session `live` unless the persisted
session has a non-empty HLS URL supplied by a real media-ingest/transcoding
integration. The application does not manufacture RTMP endpoints or stream keys
to make this gate appear successful.

The viewer passes the persisted HLS URL to the existing HLS-capable video
component.

## Chat boundary

Live chat is currently process-local and bounded to the latest 200 messages per
stream. The UI labels this history as ephemeral because it can disappear on
process restart. Chat messages are accepted only for a session whose persisted
state is `live`.

Durable stream chat requires a dedicated persistence schema or another verified
message-store contract and is not claimed by this patch.

## Monetary support boundary

Live-stream tipping is disabled. The previous gifting path did not provide a
verified settlement/accounting contract for the canonical beta. The endpoint
now fails closed and the UI explains that monetary creator support is not
configured.

No live payment, custody, token transfer, or creator payout is claimed.

## Tests

`server/stream.persistence.test.ts` exercises:

- canonical string creator ownership;
- persistence and re-read from MySQL;
- failure to mark a session live without shared media;
- a live lifecycle after a test HLS URL is attached;
- public live discovery;
- owner-only stream ending;
- removal from live discovery after end.

Hosted media ingest, real multi-user playback, durable chat, viewer-count
telemetry, and provider reconnect behavior remain deployment/integration gates.
