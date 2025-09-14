import { useRouter } from "next/navigation";
import { Eye, Edit } from "lucide-react";

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

interface BuyerRowProps {
  buyer: Buyer;
}

const BuyerRow = ({ buyer }: BuyerRowProps) => {
  const router = useRouter();

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max)
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    if (max) return `Up to ₹${max.toLocaleString()}`;
    return "Not specified";
  };

  const formatTimeline = (timeline: string) => {
    const timelineLabels: Record<string, string> = {
      ZERO_TO_THREE_MONTHS: "0-3 months",
      THREE_TO_SIX_MONTHS: "3-6 months",
      MORE_THAN_SIX_MONTHS: ">6 months",
      EXPLORING: "Exploring",
    };
    return timelineLabels[timeline] || timeline;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: "bg-blue-100 text-blue-800",
      Qualified: "bg-green-100 text-green-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      Visited: "bg-purple-100 text-purple-800",
      Negotiation: "bg-orange-100 text-orange-800",
      Converted: "bg-emerald-100 text-emerald-800",
      Dropped: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="grid grid-cols-8 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 items-center">
      <div>
        <div className="font-medium text-gray-900">{buyer.fullName}</div>
        {buyer.email && (
          <div className="text-sm text-gray-500">{buyer.email}</div>
        )}
      </div>

      <div className="text-sm text-gray-900">{buyer.phone}</div>

      <div className="text-sm text-gray-900">{buyer.city}</div>

      <div className="text-sm text-gray-900">{buyer.propertyType}</div>

      <div className="text-sm text-gray-900">
        {formatBudget(buyer.budgetMin, buyer.budgetMax)}
      </div>

      <div className="text-sm text-gray-900">
        {formatTimeline(buyer.timeline)}
      </div>

      <div>
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
            buyer.status
          )}`}
        >
          {buyer.status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(`/home/buyers/${buyer.id}`)}
          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          title="View buyer"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => router.push(`/home/buyers/${buyer.id}/edit`)}
          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
          title="Edit buyer"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BuyerRow;
