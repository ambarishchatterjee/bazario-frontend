// app/categories/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CategoriesPage() {
  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books"];

  return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-xl shadow text-center font-semibold hover:scale-105 transition">
              {cat}
            </div>
          ))}
        </div>
      </main>
  );
}
