import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
