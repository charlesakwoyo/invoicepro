import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold leading-tight">
          Simple invoicing for modern businesses
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Create invoices, track payments, and get paid faster — all in one
          place.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-black text-white px-6 py-3 rounded-md"
          >
            Start Free
          </Link>

          <Link
            href="/features"
            className="border px-6 py-3 rounded-md"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
