import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    return Response.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const { rows } = await pool.query(
      `select id, prize_id, prize_label, created_at from spins
       where user_id = $1 order by created_at desc limit 20`,
      [payload.userId],
    );
    return Response.json({ history: rows });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Could not load history." },
      { status: 500 },
    );
  }
}
