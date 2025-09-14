import Header from "@/components/Header";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <div>
        <Header />
      </div>
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 rounded-lg m-2">
        {children}
      </main>
    </div>
  );
}
