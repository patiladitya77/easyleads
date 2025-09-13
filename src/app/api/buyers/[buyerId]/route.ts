import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { baseBuyerSchema } from "@/lib/validation";

// GET /api/buyers/:id
export async function GET(
  req: Request,
  { params }: { params: { buyerId: string } }
) {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.buyerId },
      include: {
        history: {
          orderBy: { changedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

//API for updating buyer
export async function PUT(
  req: Request,
  { params }: { params: { buyerId: string } }
) {
  try {
    const body = await req.json();
    const data = baseBuyerSchema.parse(body);

    const buyer = await prisma.buyer.findUnique({
      where: { id: params.buyerId },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    const updatedBuyer = await prisma.buyer.update({
      where: { id: params.buyerId },
      data: { ...data },
    });

    // Log diff into BuyerHistory
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const diff: Record<string, [any, any]> = {};
    for (const key of Object.keys(data) as (keyof typeof data)[]) {
      const oldValue = buyer[key as keyof typeof buyer];
      const newValue = data[key];

      if (oldValue !== newValue) {
        diff[key] = [oldValue, newValue];
      }
    }

    if (Object.keys(diff).length > 0) {
      await prisma.buyerHistory.create({
        data: {
          buyerId: params.buyerId,
          changedBy: "demo",
          diff,
        },
      });
    }

    return NextResponse.json(updatedBuyer, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
