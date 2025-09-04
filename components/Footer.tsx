// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <p>© {new Date().getFullYear()} Bazario. All rights reserved.</p>
        <p className="text-sm">Made with ❤️ in India</p>
      </div>
    </footer>
  );
}
