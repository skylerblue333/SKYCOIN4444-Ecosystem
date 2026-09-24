import { getUserById } from "./db";

type HopeProfile = Awaited<ReturnType<typeof getUserById>>;

/**
 * Build the beta-safe persistent context used by HopeAI.
 *
 * The larger digital-twin/reputation/opportunity subsystem is not part of the
 * beta runtime until its database schema is fully defined and migrated.
 * This adapter deliberately uses only canonical persisted user fields.
 */
export function formatHopeProfileContext(user: HopeProfile): string {
  if (!user) return "";

  const lines = [
    "Persistent user profile context:",
    user.name ? `- Name: ${user.name}` : null,
    user.username ? `- Username: ${user.username}` : null,
    user.bio ? `- Bio: ${user.bio}` : null,
    user.verified ? "- Account verification: verified" : null,
  ].filter((line): line is string => Boolean(line));

  return lines.length > 1 ? lines.join("\n") : "";
}

export async function buildHopeProfileContext(userId: string): Promise<string> {
  const user = await getUserById(userId);
  return formatHopeProfileContext(user);
}
