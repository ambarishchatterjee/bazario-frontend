// app/vendor/layout.tsx
"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useVendorStore } from "@/lib/vendorStore";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const { vendor, fetchVendorData } = useVendorStore();
  const router = useRouter();

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-indigo-600 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-white/20">
          Vendor Panel
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <Link
            href="/vendor/dashboard"
            className="block py-2 px-4 rounded hover:bg-white/20"
          >
            Dashboard
          </Link>
          <Link
            href="/vendor/products"
            className="block py-2 px-4 rounded hover:bg-white/20"
          >
            Products
          </Link>
          <Link
            href="/vendor/orders"
            className="block py-2 px-4 rounded hover:bg-white/20"
          >
            Orders
          </Link>
          <Link
            href="/vendor/profile"
            className="block py-2 px-4 rounded hover:bg-white/20"
          >
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content with Topbar */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {vendor?.vendor?.shopName || "My Store"}
          </h2>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
