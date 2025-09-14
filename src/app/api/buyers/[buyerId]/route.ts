import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { baseBuyerSchema } from "@/lib/validation";

// GET /api/buyers/:id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, context: any) {
  const { buyerId } = context.params as { buyerId: string };

  const buyer = await prisma.buyer.findUnique({
    where: { id: buyerId },
    include: { history: { orderBy: { changedAt: "desc" }, take: 5 } },
  });

  if (!buyer)
    return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  return NextResponse.json(buyer);
}

// PUT /api/buyers/:id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: any) {
  const { buyerId } = context.params as { buyerId: string };

  try {
    const body = await req.json();
    const data = baseBuyerSchema.parse(body);

    const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!buyer)
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    const updatedBuyer = await prisma.buyer.update({
      where: { id: buyerId },
      data: { ...data },
    });

    // Log diff
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const diff: Record<string, [any, any]> = {};
    for (const key of Object.keys(data) as (keyof typeof data)[]) {
      const oldValue = buyer[key as keyof typeof buyer];
      const newValue = data[key];
      if (oldValue !== newValue) diff[key] = [oldValue, newValue];
    }

    if (Object.keys(diff).length > 0) {
      await prisma.buyerHistory.create({
        data: { buyerId, changedBy: "demo", diff },
      });
    }

    return NextResponse.json(updatedBuyer);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Something went wrong" },
      { status: 400 }
    );
  }
}

// DELETE /api/buyers/:id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, context: any) {
  const { buyerId } = context.params as { buyerId: string };

  try {
    const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!buyer)
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

    await prisma.buyer.delete({ where: { id: buyerId } });
    return NextResponse.json({ message: "Buyer deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
