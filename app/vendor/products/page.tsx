"use client";
import { useEffect, useState } from "react";
import ProductForm from "./ProductForm"; // The create product form we made
import axiosInstance from "@/lib/axiosInstance";
import { getImg } from "@/lib/utils";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  status: string;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/vendors/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (updatedProduct: FormData, id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/vendors/product/${id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Product updated");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Create or Edit Product Form */}
      {editingProduct ? (
        <EditProductForm product={editingProduct} onUpdate={handleUpdate} onCancel={() => setEditingProduct(null)} />
      ) : (
        <ProductForm />
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-600">You have no products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow rounded-lg p-4 flex flex-col">
              <Image src={product.image ? getImg(product.image) : "/placeholder.png"}
                alt={product.name} width={100} height={192}
                className="h-48 w-full object-cover rounded mb-4" />
             
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-500">₹{product.price}</p>
              <p className="text-gray-500">Stock: {product.stock}</p>
              <p className={`mt-2 font-semibold ${product.status === "approved" ? "text-green-600" : "text-red-600"}`}>
                {product.status.toUpperCase()}
              </p>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================
// Edit Product Form Component
// ==========================
interface EditProductFormProps {
  product: Product;
  onUpdate: (updatedProduct: FormData, id: string) => void;
  onCancel: () => void;
}

function EditProductForm({ product, onUpdate, onCancel }: EditProductFormProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("category", category);
    if (image) formData.append("image", image);

    await onUpdate(formData, product._id);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg space-y-4 mb-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
      <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className="w-full border rounded px-3 py-2" required />
      <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} className="w-full border rounded px-3 py-2" required />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2" />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="w-full border rounded px-3 py-2" />

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {loading ? "Updating..." : "Update"}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </form>
  );
}
