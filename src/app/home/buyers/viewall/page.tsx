import BuyersPage from "@/components/BuyersPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading buyers...</div>}>
      <BuyersPage />
    </Suspense>
  );
}
