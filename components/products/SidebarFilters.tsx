"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

interface SidebarFiltersProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    category: string;
    vendor: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      minPrice: number;
      maxPrice: number;
      category: string;
      vendor: string;
    }>
  >;
}

export default function SidebarFilters({
  filters,
  setFilters,
}: SidebarFiltersProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  // local filter state (so filters only apply when user clicks "Apply")
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounced price range update
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalFilters((prev) => ({
        ...prev,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }));
    }, 400); // debounce delay (400ms)

    return () => clearTimeout(timeout);
  }, [priceRange]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [catResp, vendorResp] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/vendors"),
        ]);

        setCategories(catResp.data);

        setVendors(vendorResp.data);
      } catch (err: any) {
      console.error("Error fetching filters:", err.response?.data || err.message);
    }
    }
    fetchFilters();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-6">
      <h3 className="text-lg font-bold">Filters</h3>

      {/* Price Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <Slider
          className="bg-gradient-to-br from-purple-500 to-blue-600"
          defaultValue={[filters.minPrice, filters.maxPrice]}
          min={0}
          max={1000000}
          step={500}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
        />
        <div className="flex justify-between text-sm mt-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={localFilters.category}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vendor Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Vendor</label>
        <select
          value={localFilters.vendor}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, vendor: e.target.value }))
          }
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">All</option>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.shopName || v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <Button
        className="w-full flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        onClick={() => setFilters(localFilters)}
      >
        Apply Filters
      </Button>
    </div>
  );
}
