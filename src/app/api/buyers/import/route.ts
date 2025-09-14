import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { z } from "zod";

const bhkMap: Record<string, string> = {
  "1": "BHK1",
  "2": "BHK2",
  "3": "BHK3",
  "4": "BHK4",
  studio: "Studio",
  Studio: "Studio",
  "BHK 1": "BHK1",
  "BHK 2": "BHK2",
  "BHK 3": "BHK3",
  "BHK 4": "BHK4",
};

const timelineMap: Record<string, string> = {
  "0-3m": "ZERO_TO_THREE_MONTHS",
  "3-6m": "THREE_TO_SIX_MONTHS",
  ">6m": "MORE_THAN_SIX_MONTHS",
  Exploring: "EXPLORING",
};

const buyerCsvSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10-15 digits"),
  city: z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]),
  bhk: z.preprocess((val) => {
    if (!val) return undefined;
    const s = String(val).trim();
    return bhkMap[s] || s;
  }, z.enum(["Studio", "BHK1", "BHK2", "BHK3", "BHK4"]).optional()),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().optional()
  ),
  budgetMax: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().optional()
  ),
  timeline: z.preprocess((val) => {
    if (!val) return undefined;
    const s = String(val).trim();
    return timelineMap[s];
  }, z.enum(["ZERO_TO_THREE_MONTHS", "THREE_TO_SIX_MONTHS", "MORE_THAN_SIX_MONTHS", "EXPLORING"])),
  source: z.enum(["Website", "Referral", "Walk-in", "Call", "Other"]),
  status: z
    .enum([
      "New",
      "Qualified",
      "Contacted",
      "Visited",
      "Negotiation",
      "Converted",
      "Dropped",
    ])
    .optional(),
  notes: z.string().max(1000).optional(),
  tags: z.preprocess((val) => {
    if (!val || val === "") return [];
    return String(val)
      .split(",")
      .map((s) => s.trim());
  }, z.array(z.string())),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const file = body.file as string;

    const parsed = Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.data.length > 200)
      return NextResponse.json(
        { error: "Max 200 rows allowed" },
        { status: 400 }
      );

    const errors: { row: number; message: string }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validRows: any[] = [];

    parsed.data.forEach((row, index) => {
      try {
        const parsedRow = buyerCsvSchema.parse(row);

        if (
          (parsedRow.propertyType === "Apartment" ||
            parsedRow.propertyType === "Villa") &&
          !parsedRow.bhk
        ) {
          errors.push({
            row: index + 2,
            message: "BHK required for Apartment/Villa",
          });
          return;
        }

        validRows.push({ ...parsedRow, ownerId: "demo-user" });
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.push({
            row: index + 2,
            message: err.issues.map((issue) => issue.message).join(", "),
          });
        } else {
          errors.push({
            row: index + 2,
            message: (err as Error).message || "Unknown error",
          });
        }
      }
    });

    if (errors.length > 0)
      return NextResponse.json({ errors }, { status: 400 });

    // Insert all valid rows in a transaction
    await prisma.$transaction(
      validRows.map((data) =>
        prisma.buyer.create({
          data: {
            ...data,
            history: {
              create: { changedBy: "demo-user", diff: { created: true } },
            },
          },
        })
      )
    );

    return NextResponse.json({ insertedCount: validRows.length });
  } catch (err) {
    console.error("CSV Import Error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
}
