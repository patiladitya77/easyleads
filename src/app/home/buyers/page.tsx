import CreateLead from "@/components/CreateLead";

export default function Dashboard() {
  return (
    <div>
      <div className="flex justify-between">
        <p>Easy Leads Dashboard</p>
        <button className="bg-black text-white rounded-md px-3 py-2">
          View all Leads
        </button>
      </div>
      <div>
        <CreateLead />
      </div>
    </div>
  );
}
