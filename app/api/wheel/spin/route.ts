import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { pool, isPgError } from "@/lib/db";
import {
  PRIZES,
  DAILY_SPIN_LIMIT,
  DAILY_SPIN_LIMIT_ENABLED,
} from "@/components/wheel/prizes";

export async function POST() {
  const token = (await cookies()).get("session")?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    return Response.json({ message: "Not authenticated." }, { status: 401 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `insert into spin_locks (user_id) values ($1) on conflict (user_id) do nothing`,
      [payload.userId],
    );
    const { rows: lockRows } = await client.query(
      `select spins_today, last_spin_date from spin_locks where user_id = $1 for update`,
      [payload.userId],
    );

    const today = new Date().toISOString().slice(0, 10);
    const lock = lockRows[0];
    const lastSpinDate = lock.last_spin_date
      ? new Date(lock.last_spin_date).toISOString().slice(0, 10)
      : null;
    const spinsToday = lastSpinDate === today ? lock.spins_today : 0;

    if (DAILY_SPIN_LIMIT_ENABLED && spinsToday >= DAILY_SPIN_LIMIT) {
      await client.query("ROLLBACK");
      return Response.json(
        {
          message: "You've used all your spins for today. Come back tomorrow!",
        },
        { status: 429 },
      );
    }

    await client.query(
      `update spin_locks set spins_today = $2, last_spin_date = $3 where user_id = $1`,
      [payload.userId, spinsToday + 1, today],
    );

    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let roll = Math.random() * totalWeight;
    let winningIndex = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      roll -= PRIZES[i].weight;
      if (roll <= 0) {
        winningIndex = i;
        break;
      }
    }
    const prize = PRIZES[winningIndex];

    const { rows } = await client.query(
      `insert into spins (user_id, prize_id, prize_label) values ($1, $2, $3)
       returning id, created_at`,
      [payload.userId, prize.id, prize.label],
    );

    await client.query("COMMIT");

    return Response.json({
      spinId: rows[0].id,
      winningIndex,
      prize: { id: prize.id, label: prize.label, color: prize.color },
      createdAt: rows[0].created_at,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    if (isPgError(err) && err.code === "40001") {
      console.warn("Spin serialization conflict", { userId: payload.userId });
      return Response.json(
        { message: "Please try spinning again." },
        { status: 409 },
      );
    }

    console.error(err);
    return Response.json(
      { message: "Spin failed. Please try again." },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
