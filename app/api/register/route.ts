import bcrypt from "bcrypt";
import { isPgError, pool } from "@/lib/db";
import { FIELD_VALIDATOR } from "@/components/RegisterCard/validator";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return Response.json({ message: "Invalid request body." }, { status: 400 });

  const { username, email, password } = body;
  const checks = {
    username: FIELD_VALIDATOR.username(username ?? ""),
    email: FIELD_VALIDATOR.email(email ?? ""),
    password: FIELD_VALIDATOR.password(password ?? ""),
  };

  const firstError = Object.values(checks).find((r) => !r.valid);
  if (firstError)
    return Response.json({ message: firstError.message }, { status: 400 });
  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `insert into users (username, email, password_hash) values ($1, $2, $3)`,
      [username, email, hash],
    );
    return Response.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    if (isPgError(err) && err.code === "23505") {
      const field = err.constraint?.includes("username") ? "Username" : "Email";
      return Response.json(
        { message: `${field} is already taken.` },
        { status: 409 },
      );
    }

    console.error(err);
    return Response.json({ message: "Registration failed." }, { status: 500 });
  }
}
