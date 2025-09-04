"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axiosInstance from "@/lib/axiosInstance";

export default function RegisterPage() {
  const [role, setRole] = useState<"buyer" | "vendor">("buyer");

  // Mutation to call backend API
  const registerMutation = useMutation({
  mutationFn: async (formData: any) => {
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      return res.data;
    } catch (err: any) {
      // Handle backend errors properly
      const errorMsg = err.response?.data?.message || "Registration failed";
      throw new Error(errorMsg);
    }
  },
  onSuccess: (data) => {
    alert("✅ Registered successfully! Please login.");
    window.location.href = "/login"; // redirect
  },
  onError: (err: any) => {
    alert(`❌ ${err.message}`);
  },
});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Prepare request payload
    const payload: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
    };

    if (role === "buyer") {
      payload.phone = formData.get("phone");
      payload.address = formData.get("address");
    } else {
      payload.shopName = formData.get("shopName");
      payload.businessCity = formData.get("businessCity");
      payload.gst = formData.get("gst");
    }

    registerMutation.mutate(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Role Toggle */}
      <div className="space-y-2">
        <Label>Register as</Label>
        <RadioGroup
          defaultValue="buyer"
          onValueChange={(val) => setRole(val as "buyer" | "vendor")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buyer" id="buyer" />
            <Label htmlFor="buyer">Buyer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vendor" id="vendor" />
            <Label htmlFor="vendor">Vendor</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Common Fields */}
      <Input name="name" type="text" placeholder="Full Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />

      {/* Vendor-Specific Fields */}
      {role === "vendor" && (
        <>
          <Input name="shopName" type="text" placeholder="Shop Name" required />
          <Input
            name="businessCity"
            type="text"
            placeholder="Business City"
            required
          />
          <Input name="gst" type="text" placeholder="GST Number (optional)" />
        </>
      )}

      {/* Buyer-Specific Fields */}
      {role === "buyer" && (
        <>
          <Input name="phone" type="text" placeholder="Phone Number" required />
          <Input
            name="address"
            type="text"
            placeholder="Shipping Address"
            required
          />
        </>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Register"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-purple-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
