"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import axiosInstance from "@/lib/axiosInstance";

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/my");
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    
    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return <div className="p-6 text-center">Please login to view orders.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <h2 className="font-semibold">Order #{order._id}</h2>
              <p>Status: {order.status}</p>
              <p>Total Items: {order.items.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
