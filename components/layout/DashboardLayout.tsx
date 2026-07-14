"use client";

import { IAMGuard } from "@/lib/iamGuard";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <IAMGuard>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 px-8 overflow-auto bg-green-50">
            {children}
          </main>
        </div>
      </div>
    </IAMGuard>
  );
}
