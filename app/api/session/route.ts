import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  const payload = token ? await verifyToken(token) : null;

  return Response.json({
    authenticated: Boolean(payload),
    username: payload?.username ?? null,
  });
}
