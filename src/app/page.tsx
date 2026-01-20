import Link from "next/link";

export default function PublicHomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* ================= NAVBAR ================= */}
            <header className="sticky top-0 z-50 bg-white border-b">
                <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">QuickPay</h1>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="#" className="text-gray-600 hover:text-blue-600">
                            Features
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-blue-600">
                            Pricing
                        </Link>
                        <Link href="#" className="text-gray-600 hover:text-blue-600">
                            Company
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            </header>

            {/* ================= HERO ================= */}
            <section className="flex-1 bg-blue-600">
                <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
                            Smart Invoicing <br /> Made Simple
                        </h2>

                        <p className="text-lg text-blue-100 mb-8">
                            Create invoices, manage clients, and track payments — all from one
                            clean dashboard.
                        </p>

                        <div className="flex gap-4">
                            <Link
                                href="/register"
                                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
                            >
                                Start Free
                            </Link>

                            <Link
                                href="/login"
                                className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Hero visual card */}
                    <div className="hidden md:block">
                        <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-6">
                            <h4 className="font-semibold mb-4">Invoice Preview</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Invoice #</span>
                                    <span className="font-medium">QP-2045</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Client</span>
                                    <span className="font-medium">Acme Ltd</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total</span>
                                    <span className="font-semibold text-blue-600">$1,240.00</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg">
                                Send Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-20 bg-gray-50 text-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
                        Everything you need to get paid
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Fast Invoicing",
                                desc: "Create professional invoices in seconds.",
                            },
                            {
                                title: "Client Management",
                                desc: "Organize all your clients in one place.",
                            },
                            {
                                title: "Payment Tracking",
                                desc: "Know exactly when you get paid.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                <h4 className="font-semibold mb-2 text-gray-900">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ================= FOOTER ================= */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-white font-semibold mb-3">QuickPay</h4>
                        <p className="text-sm">
                            Modern invoicing platform for freelancers and businesses.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Home</li>
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 text-center py-4 text-sm">
                    © {new Date().getFullYear()} QuickPay. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
