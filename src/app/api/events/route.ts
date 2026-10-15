import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { validXPostInput } from "@/lib/x-post";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await listEvents();
    return NextResponse.json(events);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.title)
      return NextResponse.json({ error: "title required" }, { status: 400 });
    if (!validXPostInput(body.x_post_url))
      return NextResponse.json({ error: "Enter a valid X post URL (https://x.com/user/status/123)." }, { status: 400 });
    const event = await createEvent(body);
    return NextResponse.json(event, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
