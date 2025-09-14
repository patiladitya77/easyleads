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

// API for getting all the leads
// API for getting all buyers with improved error handling
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = 10;

    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const status = searchParams.get("status");
    const timeline = searchParams.get("timeline");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (
      city &&
      ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"].includes(city)
    ) {
      where.city = city;
    }

    if (
      propertyType &&
      ["Apartment", "Villa", "Plot", "Office", "Retail"].includes(propertyType)
    ) {
      where.propertyType = propertyType;
    }

    if (
      status &&
      [
        "New",
        "Qualified",
        "Contacted",
        "Visited",
        "Negotiation",
        "Converted",
        "Dropped",
      ].includes(status)
    ) {
      where.status = status;
    }

    if (
      timeline &&
      [
        "ZERO_TO_THREE_MONTHS",
        "THREE_TO_SIX_MONTHS",
        "MORE_THAN_SIX_MONTHS",
        "EXPLORING",
      ].includes(timeline)
    ) {
      where.timeline = timeline as
        | "ZERO_TO_THREE_MONTHS"
        | "THREE_TO_SIX_MONTHS"
        | "MORE_THAN_SIX_MONTHS"
        | "EXPLORING";
    }

    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { fullName: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.buyer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      buyers,
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  } catch (error) {
    console.error("Buyers API Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
