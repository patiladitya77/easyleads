"use client";
import CreateLead from "@/components/CreateLead";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleViewAll = () => {
    router.push("/home/buyers/viewall");
  };

  const handleExport = async () => {
    const res = await fetch("/api/buyers/export");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "buyers_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const res = await fetch("/api/buyers/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: text }),
    });

    const data = await res.json();
    if (res.ok) alert(`Imported ${data.insertedCount} rows successfully`);
    else alert(`Errors:\n${JSON.stringify(data.errors, null, 2)}`);
    e.target.value = ""; // reset input
  };

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Easy Leads Dashboard
        </h1>
        <button
          className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition cursor-pointer"
          onClick={handleViewAll}
        >
          <div className="flex items-center">
            <p>View All Leads</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={handleExport}
        >
          Export CSV
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          onClick={handleImportClick}
        >
          Import CSV
        </button>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <CreateLead />
      </div>
    </div>
  );
}
