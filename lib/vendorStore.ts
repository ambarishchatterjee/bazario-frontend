// lib/vendorStore.ts
import { create } from "zustand";
import axiosInstance from "./axiosInstance";

interface VendorState {
  vendor: any | null;
  products: any[];
  orders: any[];
  fetchVendorData: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  createProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  fetchVendorProfile: () => Promise<void>;
  updateVendorProfile: (data: any) => Promise<void>;
}

export const useVendorStore = create<VendorState>((set, get) => ({
  vendor: null,
  products: [],
  orders: [],

  fetchVendorData: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [vendorRes, productsRes] = await Promise.all([
        axiosInstance.get("/vendors/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.get("/vendors/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      set({
        vendor: vendorRes.data,
        products: productsRes.data || [],
      });
    } catch (err) {
      console.error("Failed to fetch vendor data:", err);
    }
  },

  fetchOrders: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.get("/vendors/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Adjust this according to the API response structure
      // If your API returns { orders: [...] } instead of just [...]
      set({ orders: res.data.orders || res.data || [] });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  },

  createProduct: async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        formData.append(key, product[key]);
      });

      const res = await axiosInstance.post("/vendors/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({ products: [res.data.product, ...state.products] }));
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  },

  updateProduct: async (id, product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.put(`/vendors/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        products: state.products.map((p) => (p._id === id ? res.data : p)),
      }));
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axiosInstance.delete(`/vendors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  },
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.put(
        `/vendors/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the order in local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? res.data : order
        ),
      }));
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  },

  fetchVendorProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axiosInstance.get("/vendors/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ vendor: res.data });
    } catch (err) {
      console.error("Failed to fetch vendor profile:", err);
    }
  },

  updateVendorProfile: async (data: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axiosInstance.put("/vendors/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ vendor: res.data });
    } catch (err) {
      console.error("Failed to update vendor profile:", err);
    }
  },
}));
