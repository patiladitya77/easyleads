"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBuyer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    propertyType: "",
    bhk: "",
    purpose: "Buy", // default
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    source: "",
    status: "New",
    notes: "",
  });

  // field-level errors
  const [bhkError, setBhkError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // validation: bhk required for Apartment/Villa
    const needsBhk =
      formData.propertyType === "Apartment" ||
      formData.propertyType === "Villa";

    if (needsBhk && !formData.bhk) {
      setBhkError("BHK is required for Apartment and Villa");
      return;
    }

    // parse budgets to numbers (or undefined)
    const budgetMinNum =
      formData.budgetMin.trim() === ""
        ? undefined
        : parseInt(formData.budgetMin, 10);
    const budgetMaxNum =
      formData.budgetMax.trim() === ""
        ? undefined
        : parseInt(formData.budgetMax, 10);

    if (
      typeof budgetMinNum === "number" &&
      typeof budgetMaxNum === "number" &&
      budgetMaxNum < budgetMinNum
    ) {
      setBudgetError(
        "Maximum budget must be greater than or equal to minimum budget"
      );
      return;
    }

    // build payload: omit empty strings to avoid sending "" where you want undefined
    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || undefined,
      city: formData.city || undefined,
      propertyType: formData.propertyType || undefined,
      bhk: formData.bhk || undefined,
      purpose: formData.purpose || undefined,
      budgetMin: typeof budgetMinNum === "number" ? budgetMinNum : undefined,
      budgetMax: typeof budgetMaxNum === "number" ? budgetMaxNum : undefined,
      timeline: formData.timeline || undefined,
      source: formData.source || undefined,
      status: formData.status || undefined,
      notes: formData.notes || undefined,
      tags: [],
    };

    try {
      // change the URL to /api/v1/buyers if your API lives there
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/home/buyers");
      } else {
        const payload = await res.json().catch(() => ({}));
        console.error("Failed to create buyer", payload);
        setSubmitError(payload.error || "Failed to create buyer");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // if propertyType changes away from Apartment/Villa, clear bhk & bhk error
    if (name === "propertyType") {
      if (value !== "Apartment" && value !== "Villa") {
        setFormData((prev) => ({ ...prev, propertyType: value, bhk: "" }));
        setBhkError("");
        return;
      }
    }

    // sanitize budget inputs to digits only (optional UX)
    if (name === "budgetMin" || name === "budgetMax") {
      const digits = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: digits }));
      setBudgetError("");
      return;
    }

    if (name === "bhk") {
      setBhkError("");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Buyer</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name*</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone*</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select City</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Zirakpur">Zirakpur</option>
            <option value="Panchkula">Panchkula</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Office">Office</option>
            <option value="Retail">Retail</option>
          </select>
        </div>

        {/* Conditional BHK Field */}
        {(formData.propertyType === "Apartment" ||
          formData.propertyType === "Villa") && (
          <div>
            <label className="block text-sm font-medium mb-1">BHK*</label>
            <select
              name="bhk"
              value={formData.bhk}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select BHK</option>
              <option value="BHK1">1 BHK</option>
              <option value="BHK2">2 BHK</option>
              <option value="BHK3">3 BHK</option>
              <option value="BHK4">4 BHK</option>
              <option value="Studio">Studio</option>
            </select>
            {bhkError && <p className="text-red-600 mt-1">{bhkError}</p>}
          </div>
        )}

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium mb-1">Purpose</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Budget Min (INR)
            </label>
            <input
              name="budgetMin"
              value={formData.budgetMin}
              onChange={handleChange}
              placeholder="e.g. 5000000"
              inputMode="numeric"
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Budget Max (INR)
            </label>
            <input
              name="budgetMax"
              value={formData.budgetMax}
              onChange={handleChange}
              placeholder="e.g. 8000000"
              inputMode="numeric"
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>
        </div>
        {budgetError && <p className="text-red-600">{budgetError}</p>}

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium mb-1">Timeline</label>
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select Timeline</option>
            <option value="ZERO_TO_THREE_MONTHS">0–3 months</option>
            <option value="THREE_TO_SIX_MONTHS">3–6 months</option>
            <option value="MORE_THAN_SIX_MONTHS">6+ months</option>
            <option value="EXPLORING">Exploring</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Walk_in">Walk-in</option>
            <option value="Call">Call</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Add extra details..."
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Submit / Cancel */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => router.push("/home/buyers")}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Save Buyer
          </button>
        </div>

        {submitError && <p className="text-red-600 mt-2">{submitError}</p>}
      </form>
    </div>
  );
}
