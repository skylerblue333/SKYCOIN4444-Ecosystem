import { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db";

/**
 * Daily 7 AM UTC: Upgrade all coins for all users
 * Endpoint: POST /api/scheduled/daily-coin-upgrade
 */
export async function handleDailyCoinUpgrade(req: Request, res: Response) {
  try {
    // Verify cron authentication
    const user = (req as any).user;
    if (!user?.isCron || !user?.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    // Update all wallet balances with 1.5x multiplier
    const result = await db.execute(sql`
      UPDATE user_wallets 
      SET 
        sky4_balance = sky4_balance * 1.5,
        doge_balance = doge_balance * 1.5,
        trump_balance = trump_balance * 1.5,
        charity_balance = charity_balance * 1.5,
        xp_balance = xp_balance * 1.5,
        creator_balance = creator_balance * 1.5,
        updated_at = NOW()
      WHERE sky4_balance > 0 
         OR doge_balance > 0 
         OR trump_balance > 0 
         OR charity_balance > 0 
         OR xp_balance > 0 
         OR creator_balance > 0
    `);

    // Log transaction for each user (batch insert)
    await db.execute(sql`
      INSERT INTO transactions (user_id, type, coin_type, amount, description, status, created_at)
      SELECT 
        u.id,
        'upgrade',
        'all',
        (COALESCE(w.sky4_balance, 0) + COALESCE(w.doge_balance, 0) + COALESCE(w.trump_balance, 0) + 
         COALESCE(w.charity_balance, 0) + COALESCE(w.xp_balance, 0) + COALESCE(w.creator_balance, 0)) / 1.5,
        'Daily 7 AM automatic coin upgrade (1.5x multiplier)',
        'completed',
        NOW()
      FROM users u
      JOIN user_wallets w ON u.id = w.user_id
      WHERE u.status = 'active'
    `);

    res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Daily coin upgrade completed successfully",
      affectedRows: result.rowsAffected || 0,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    res.status(500).json({
      error: err.message,
      stack: err.stack,
      context: { url: req.url, taskUid: (req as any).user?.taskUid },
      timestamp: new Date().toISOString(),
    });
  }
}
