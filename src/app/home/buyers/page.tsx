import CreateLead from "@/components/CreateLead";

export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Easy Leads Dashboard
        </h1>
        <button className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2 transition cursor-pointer">
          <div className="flex">
            <p>View All Leads</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 mx-1"
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

      <div className="bg-white shadow-md rounded-xl p-6">
        <CreateLead />
      </div>
    </div>
  );
}
