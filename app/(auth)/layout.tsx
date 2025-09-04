// app/(auth)/layout.tsx
import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src={"/icon.webp"}  alt="Bazario" width={48} height={'48'} />
          
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Bazario</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
