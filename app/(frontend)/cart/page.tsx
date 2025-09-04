"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { getImg } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter()

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return; // prevent invalid quantity
    try {
      await axiosInstance.put(
        `/carts/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await axiosInstance.delete(`/carts/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete("/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const handlePostOrder = async () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  try {
    const res = await axiosInstance.post(
      "/orders",
      {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("✅ Order placed successfully!");

    // clear cart after order success
    await clearCart();
    router.push("/orders")
    
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      err.response?.statusText ||
      err.message ||
      "Unknown error";
    alert(`❌ Failed to order: ${message}`);
    console.error(err);
  }
};


  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!token) return <p className="text-center mt-10">Please login to view your cart.</p>;

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between bg-white shadow rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.image ? getImg(item.product.image) : "/placeholder.png"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold">{item.product.name}</h2>
                    <p className="text-gray-500">₹{item.product.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => removeItem(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-semibold">Total: ₹{totalAmount}</p>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Clear Cart
              </button>
              <button className="bg-green-500 px-6 py-2 text-white rounded hover:bg-green-600" onClick={handlePostOrder}>
                Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
