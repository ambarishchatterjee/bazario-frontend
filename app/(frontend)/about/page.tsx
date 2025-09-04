// app/about/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">About Bazario</h2>
        <p className="text-gray-700 leading-relaxed">
          Bazario is a multi-vendor e-commerce platform designed to empower small businesses and
          buyers across India. Vendors can showcase their shops, while buyers can explore thousands
          of products in one place.
        </p>
      </main>
  );
}
