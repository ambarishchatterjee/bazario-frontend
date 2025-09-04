// cartStore.ts
import { create } from "zustand";
import axios from "axios";
import axiosInstance from "./axiosInstance";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  cartCount: 0,

  fetchCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axiosInstance.get("/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = data.items || data.cart?.items || [];
      set({
        cart: items,
        cartCount: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
      });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      set({ cart: [], cartCount: 0 });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.post(
        "/carts",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh cart after add
      await useCartStore.getState().fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.put(
        `/carts/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh cart after update
      await useCartStore.getState().fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  },

  removeFromCart: async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.delete(`/carts/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // refresh cart after remove
      await useCartStore.getState().fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  },

  clearCart: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.delete("/carts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // refresh cart after clear
      set({ cart: [], cartCount: 0 });
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  },
}));
