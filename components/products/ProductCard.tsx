"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import axiosInstance from "@/lib/axiosInstance";
import { getImg } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    category?: { name: string };
    vendor?: { shopName?: string; name?: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    console.log("🛒 Adding product:", product);

    if (!product?._id) {
      alert("❌ Product ID not found");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (token) {
        // 🔹 Logged-in user → send to API
        const response = await axiosInstance.post(
          "/carts",
          {
            productId: product._id, // ✅ FIXED field name
            quantity: 1,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 || response.status === 201) {
          alert("✅ Added to cart");
          addToCart(product._id, 1);
          router.push("/cart"); // optional redirect
        }
      } else {
        // 🔹 Guest user → store in localStorage
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

        // check if product already in cart
        const existing = guestCart.find(
          (item: any) => item.productId === product._id
        );

        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({
            productId: product._id, // ✅ same key as backend
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        alert("✅ Added to cart (guest)");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Unknown error";
      alert(`❌ Failed to add to cart: ${message}`);
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden flex flex-col">
      <Image src={product.image ? getImg(product.image) : "/placeholder.png"}
        alt={product.name} width={'100'} height={192}
        className="h-48 w-full  object-cover" />
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category?.name}</p>
        <p className="text-sm text-gray-500">
          Sold by: {product.vendor?.shopName || product.vendor?.name}
        </p>
        <p className="text-xl font-bold mt-2">₹{product.price}</p>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 text-center bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
