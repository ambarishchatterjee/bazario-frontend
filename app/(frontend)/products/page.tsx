"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import SidebarFilters from "@/components/products/SidebarFilters";
import ProductCard from "@/components/products/ProductCard";

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 300000,
    category: "",
    vendor: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await axiosInstance.get("/products", { params: filters });
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center p-10">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <aside className="md:col-span-1">
        <SidebarFilters filters={filters} setFilters={setFilters} />
      </aside>

      {/* Product Grid */}
      <section className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.length > 0 ? (
          data.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
}
