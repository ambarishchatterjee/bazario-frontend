"use client";
import { useEffect, useState } from "react";
import { useVendorStore } from "@/lib/vendorStore";
import { getImg } from "@/lib/utils";

export default function VendorDashboardPage() {
  const { vendor, products, fetchVendorData, deleteProduct } = useVendorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorData().finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading vendor dashboard...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      {vendor ? (
        <>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">{vendor.vendor.shopName}</span> | Status:{" "}
            {vendor.vendor.approved ? (
              <span className="text-green-600 font-semibold">Approved</span>
            ) : (
              <span className="text-red-600 font-semibold">Pending</span>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold">Total Products</h2>
              <p className="text-3xl font-bold mt-2">{products.length}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white shadow rounded-lg p-4">
                <img
                  src={p.image ? getImg(p.image) : "/placeholder.png"}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="font-semibold mt-2">{p.name}</h3>
                <p>₹{p.price}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteProduct(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No vendor data found.</p>
      )}
    </div>
  );
}
