import { NextResponse } from "next/server";
import { addMedia, getEvent } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { extFor, storeFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const event = await getEvent(Number(id)).catch(() => null);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "file required" }, { status: 400 });

  if (!extFor(file.type))
    return NextResponse.json(
      { error: `Unsupported type ${file.type}` },
      { status: 415 }
    );

  try {
    const { url } = await storeFile(event.id, file);
    const media = await addMedia(event.id, {
      url,
      type: file.type.startsWith("video") ? "video" : "image",
      caption: (form.get("caption") as string) || undefined,
    });
    return NextResponse.json(media, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
