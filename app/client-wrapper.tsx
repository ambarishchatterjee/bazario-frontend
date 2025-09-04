// app/client-wrapper.tsx
"use client";

import { useEffect } from "react";
import QueryProvider from "@/lib/queryProvider";
import { useAuthStore } from "@/lib/authStore";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return <QueryProvider>{children}</QueryProvider>;
}
