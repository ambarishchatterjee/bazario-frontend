"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { getImg } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post("/carts", {
        product: product._id,
        quantity: 1,
      });
      alert("✅ Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add product to cart");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Product Image */}
        <div>
          <img
            src={product.image ? getImg(product.image) : "/placeholder.png"}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </div>

        {/* Right - Product Details */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.category?.name}</p>
            <p className="text-gray-600 text-sm">
              Sold by <span className="font-medium">{product.vendor?.shopName}</span>
            </p>
            <p className="text-primary text-2xl font-bold mt-4">₹{product.price}</p>
            <p className="text-gray-700 mt-4">{product.description}</p>
          </div>

          {/* Action */}
          <div className="flex items-center gap-4">
            <Button className="px-6 py-2" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="outline" className="px-6 py-2">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
