"use client";

import React, { useEffect, useState } from "react";
import { use } from "react";

const TIMELINE_LABELS: Record<string, string> = {
  ZERO_TO_THREE_MONTHS: "0-3 Months",
  THREE_TO_SIX_MONTHS: "3-6 Months",
  MORE_THAN_SIX_MONTHS: "6+ Months",
  EXPLORING: "Exploring",
};

interface Buyer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  purpose: "Buy" | "Rent";
  budgetMin: number | null;
  budgetMax: number | null;
  city: string;
  propertyType: string;
  bhk: string | null;
  timeline: string;
  source: string;
  status: string;
  notes: string | null;
  tags: string[];
  updatedAt: string;
  history: Array<{
    id: string;
    changedBy: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    diff: Record<string, [any, any]>;
    createdAt: string;
  }>;
}

export default function BuyerDetails({
  params,
}: {
  params: Promise<{ buyerId: string }>;
}) {
  const { buyerId } = use(params);
  const [buyer, setBuyer] = useState<Buyer>();

  useEffect(() => {
    async function fetchBuyer() {
      const res = await fetch(`/api/buyers/${buyerId}`);
      const data = await res.json();
      setBuyer(data);
      console.log("Fetched Buyer:", data);
    }
    fetchBuyer();
  }, [buyerId]);

  if (!buyer) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Buyer Details</h1>

      <div>
        <strong>Name:</strong> {buyer.fullName}
      </div>
      <div>
        <strong>Email:</strong> {buyer.email}
      </div>
      <div>
        <strong>Phone:</strong> {buyer.phone}
      </div>
      <div>
        <strong>Purpose:</strong> {buyer.purpose}
      </div>
      <div>
        <strong>Budget:</strong> ₹{buyer.budgetMin} – ₹{buyer.budgetMax}
      </div>
      <div>
        <strong>City:</strong> {buyer.city}
      </div>
      <div>
        <strong>Property Type:</strong> {buyer.propertyType}
      </div>
      <div>
        <strong>BHK:</strong> {buyer.bhk}
      </div>
      <div>
        <strong>Timeline:</strong>{" "}
        {TIMELINE_LABELS[buyer.timeline] || buyer.timeline}
      </div>

      <div>
        <strong>Status:</strong> {buyer.status}
      </div>
      <div>
        <strong>Source:</strong> {buyer.source}
      </div>
      <div>
        <strong>Notes:</strong> {buyer.notes}
      </div>
      <div>
        <strong>Last Updated:</strong>{" "}
        {new Date(buyer.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
