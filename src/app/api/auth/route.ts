import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  createSession,
  destroySession,
  getSessionUser,
  verifyUser,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const SESSION_DAYS = 30;

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ admin: !!user, user });
}

export async function POST(req: Request) {
  const { email, password } = await req
    .json()
    .catch(() => ({ email: "", password: "" }));

  try {
    const user = await verifyUser(String(email ?? ""), String(password ?? ""));
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const token = await createSession(user.id);
    const store = await cookies();
    store.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 86400,
    });
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
