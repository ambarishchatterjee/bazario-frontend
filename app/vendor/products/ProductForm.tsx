"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface Category {
  _id: string;
  name: string;
}

export default function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product created successfully!");
      console.log(res.data);

      // Reset form
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setCategory("");
      setImage(null);
    } catch (err: any) {
      alert(
        `❌ Failed to create product: ${
          err.response?.data?.message || err.message
        }`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(parseInt(e.target.value))}
        className="w-full border rounded px-3 py-2"
        required
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(parseInt(e.target.value))}
        className="w-full border rounded px-3 py-2"
        required
      />

      {/* Dropdown for categories */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Create Product"}
      </button>
    </form>
  );
}
