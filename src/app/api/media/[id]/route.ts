import { NextResponse } from "next/server";
import { deleteMedia } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { removeFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const url = await deleteMedia(Number(id));
  if (!url) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeFile(url);
  return NextResponse.json({ ok: true });
}
