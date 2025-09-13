import { prisma } from "@/lib/prisma";
import { baseBuyerSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

//API for creater buyer lead
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = baseBuyerSchema.parse(body);
    const buyer = await prisma.buyer.create({
      data: {
        ...data,
        ownerId: "demo",
      },
    });

    return NextResponse.json(buyer, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

//API for getting all the leads
export async function GET() {
  try {
    const buyers = await prisma.buyer.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(buyers);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
