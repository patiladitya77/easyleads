"use client";

import { formatDateTime } from "@/lib/helper";
import React, { useEffect, useState } from "react";

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
  const { buyerId } = React.use(params);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Buyer>>({});

  useEffect(() => {
    async function fetchBuyer() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + buyerId);
      const data = await res.json();
      setBuyer(data);
      setForm(data);
    }
    fetchBuyer();
  }, [buyerId]);

  if (!buyer) return <div>Loading…</div>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/buyers/${buyerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, updatedAt: buyer.updatedAt }), // 👈 concurrency check
    });

    if (res.ok) {
      const updated = await res.json();
      setBuyer(updated);
      setForm(updated);
      setEditing(false);
    } else {
      const err = await res.json();
      alert(err.error || "Failed to update");
    }
  };

  return (
    <div className="p-6 space-y-3">
      <div>
        <h1 className="text-xl font-bold">Buyer Details</h1>

        {editing ? (
          <div className="space-y-2">
            <input
              className="border p-2 w-full"
              name="fullName"
              value={form.fullName || ""}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
            />
            <select
              className="border p-2 w-full"
              name="purpose"
              value={form.purpose || ""}
              onChange={handleChange}
            >
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
            <textarea
              className="border p-2 w-full"
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
            />

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-1">
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
              <strong>Buy / Rent:</strong> {buyer.purpose}
            </div>
            <div>
              <strong>Budget:</strong> {buyer.budgetMin} - {buyer.budgetMax}
            </div>
            <div>
              <strong>City:</strong> {buyer.city}
            </div>
            <div>
              <strong>Notes:</strong> {buyer.notes}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 bg-black text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Change History</h2>
        {buyer.history.length === 0 ? (
          <p className="text-sm text-gray-500">No changes yet.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {buyer.history
              .slice(-5)
              .reverse()
              .map((h) => (
                <li key={h.id} className="border p-3 rounded bg-gray-50">
                  <p className="text-xs text-gray-600">
                    {formatDateTime(h.createdAt)} by {h.changedBy || "Unknown"}
                  </p>
                  <ul className="ml-4 list-disc">
                    {Object.entries(h.diff).map(([field, [oldVal, newVal]]) => (
                      <li key={field}>
                        <strong>{field}</strong>:{" "}
                        <span className="line-through text-red-500">
                          {String(oldVal)}
                        </span>{" "}
                        →{" "}
                        <span className="text-green-600">{String(newVal)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
