import { prisma } from "@/src/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/shared/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const entrySchema = z.object({
  age: z.number().int().nonnegative(),
  kind: z.enum(["income", "expense"]),
  label: z.string().min(1),
  amount: z.number().int().nonnegative(),
});

const bodySchema = z.object({
  title: z.string().min(1),
  baseAge: z.number().int().nonnegative(),
  entries: z.array(entrySchema),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const sims = await prisma.simulation.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { updatedAt: "desc" },
    include: { entries: true },
  });
  return NextResponse.json(sims);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  try {
    const json = await req.json();
    const { title, baseAge, entries } = bodySchema.parse(json);
    const created = await prisma.simulation.create({
      data: {
        title,
        baseAge,
        userId: user.id,
        entries: { createMany: { data: entries } },
      },
      include: { entries: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "invalid" }, { status: 400 });
  }
}


