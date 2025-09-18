import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { name, email, password } = bodySchema.parse(json);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ message: "既に登録済みです" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, passwordHash } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "invalid" }, { status: 400 });
  }
}


