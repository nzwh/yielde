import bcrypt from "bcrypt";
import { pool } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return Response.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  const { email, password } = body;

  let user;
  try {
    const { rows } = await pool.query(
      `select id, username, password_hash from users where lower(email) = lower($1)`,
      [email],
    );
    user = rows[0];
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Login failed. Please try again." },
      { status: 500 },
    );
  }

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return Response.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  const token = await signToken({ userId: user.id, username: user.username });

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });

  return Response.json({ success: true });
}
