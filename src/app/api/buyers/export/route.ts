// app/api/buyers/export/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const buyers = await prisma.buyer.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const headers = [
    "fullName",
    "email",
    "phone",
    "city",
    "propertyType",
    "bhk",
    "purpose",
    "budgetMin",
    "budgetMax",
    "timeline",
    "source",
    "notes",
    "tags",
    "status",
  ];

  const csvRows = [
    headers.join(","),
    ...buyers.map((row) =>
      headers
        .map((h) => {
          let val = row[h as keyof typeof row];
          if (Array.isArray(val)) val = val.join("|");
          if (val == null) val = "";
          val = String(val).replace(/"/g, '""');
          if (val.includes(",") || val.includes('"') || val.includes("\n"))
            val = `"${val}"`;
          return val;
        })
        .join(",")
    ),
  ];

  return new Response(csvRows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="buyers_export.csv"`,
    },
  });
}
