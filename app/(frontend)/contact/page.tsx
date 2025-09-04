// app/contact/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <form className="space-y-6 bg-white p-6 rounded-xl shadow">
          <input type="text" placeholder="Your Name" className="w-full border px-4 py-2 rounded-lg" />
          <input type="email" placeholder="Your Email" className="w-full border px-4 py-2 rounded-lg" />
          <textarea placeholder="Your Message" className="w-full border px-4 py-2 rounded-lg h-32"></textarea>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Send Message
          </button>
        </form>
      </main>
  );
}
