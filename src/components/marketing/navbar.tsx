import Link from "next/link";

export default function MarketingNavbar() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          InvoicePro
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>

          <Link href="/login" className="text-gray-700">
            Login
          </Link>

          <Link
            href="/register"
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
