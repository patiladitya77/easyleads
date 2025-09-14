"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import BuyerRow from "@/components/BuyerRow";

interface Buyer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  propertyType: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  status: string;
  updatedAt: string;
}

interface BuyersResponse {
  buyers: Buyer[];
  total: number;
  page: number;
  totalPages: number;
}

export default function BuyersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [totalPages, setTotalPages] = useState(1);

  const cities = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
  const statuses = [
    "New",
    "Qualified",
    "Contacted",
    "Visited",
    "Negotiation",
    "Converted",
    "Dropped",
  ];

  const getBuyers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      params.set("page", currentPage.toString());
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCity) params.set("city", selectedCity);
      if (selectedStatus) params.set("status", selectedStatus);

      const response = await fetch(`/api/buyers?${params.toString()}`);
      const data: BuyersResponse = await response.json();

      if (response.ok) {
        setBuyers(data.buyers);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching buyers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedStatus) params.set("status", selectedStatus);

    router.push(`/home/buyers/viewall?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    getBuyers();
  }, [currentPage, searchTerm, selectedCity, selectedStatus]);

  useEffect(() => {
    updateURL();
  }, [currentPage, searchTerm, selectedCity, selectedStatus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Buyers</h1>
        <div className="text-sm text-gray-600">
          {buyers.length} buyers found
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCity("");
              setSelectedStatus("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Buyers List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading buyers...</p>
          </div>
        ) : buyers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No buyers found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-8 gap-4 pb-3 mb-4 border-b font-medium text-gray-700 text-sm">
              <div>Name</div>
              <div>Phone</div>
              <div>City</div>
              <div>Property Type</div>
              <div>Budget</div>
              <div>Timeline</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {buyers.map((buyer) => (
              <BuyerRow key={buyer.id} buyer={buyer} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
