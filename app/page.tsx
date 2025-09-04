"use client";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/products/ProductCard";
import axiosInstance from "@/lib/axiosInstance";
import { getImg } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  // Categories
  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories");
      return data;
    },
  });

  // Vendors
  const { data: vendors = [], isLoading: vendLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/vendors");
      return data;
    },
  });

  // Products (limit 8)
  const { data: products = [], isLoading: prodLoading } = useQuery({
    queryKey: ["products", { limit: 8 }],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/products?limit=8");
      return data;
    },
  });

  if (catLoading || vendLoading || prodLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }


  return (
    <>
    <Navbar />
    <div className="space-y-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Welcome to Our Marketplace</h1>
        <p className="mt-4 text-lg">Shop products from trusted vendors</p>
        <Link href={"/products"}>
          <button className="mt-6 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Categories */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat:any) => (
            <div
              key={cat._id}
              className="p-4 bg-white shadow rounded-xl text-center hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Vendors */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">Featured Vendors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {vendors.slice(0, 4).map((v:any) => (
            <div
              key={v._id}
              className="p-4 bg-white shadow rounded-xl text-center hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{v.shopName || v.name}</h3>
              <Link href={`/products?vendor=${v._id}`}>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg">
                  View Products
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Products */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">Recent Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p:any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold">Become a Vendor</h2>
        <p className="mt-2 text-gray-600">
          Start selling and reach thousands of customers.
        </p>
        <Link href={"/register"}>
          <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
            Join Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>
          © {new Date().getFullYear()} Your Marketplace. All rights reserved.
        </p>
      </footer>
    </div>
    </>
  );
}
