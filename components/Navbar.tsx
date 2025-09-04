"use client";
import { useAuthStore } from "@/lib/authStore";
import { useCartStore } from "@/lib/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const { user,   loadUser } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.cartCount);

  const router = useRouter()


  useEffect(() => {
    loadUser();
  }, [loadUser]); // only run once on mount

  const handleLogout = () => {
    logout();
    router.push("/login"); // ✅ navigate after clearing session
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex text-2xl font-bold align-middle content-center gap-3 items-center">
        
        <Image src={"/icon.webp"}  alt="Bazario" width={48} height={48}  className="mb-2"/>
          Bazario
        </Link>

        <div className="space-x-6 flex items-center">
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>

          {user ? (
            <>
              <Link href="/cart">
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link href="/orders">Orders</Link>
              <span className="font-semibold">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-white text-purple-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
