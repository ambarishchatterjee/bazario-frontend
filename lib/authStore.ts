import { create } from "zustand";
import axios from "axios";
import { useCartStore } from "./cartStore";
import axiosInstance from "./axiosInstance";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null,

  login: async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    set({ user: data.user, token: data.token, role: data.user.role });

    // return user so component can redirect
    return data.user;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];

    set({ user: null, token: null, role: null });

    useCartStore.getState().clearCart();
  },

  loadUser: async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const { data } = await axiosInstance.get("/auth/me");
      set({ user: data.user, token, role });

      if (role === "customer") {
        await useCartStore.getState().fetchCart();
      }
    } catch {
      set({ user: null, token: null, role: null });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      useCartStore.getState().clearCart();
    }
  },
}));
