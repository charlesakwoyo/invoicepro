"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Create your account
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          Start managing your invoices today
        </p>

        {/* Google Register */}
        <button className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 mb-4 hover:bg-gray-50 text-gray-900">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">
            Sign up with Google
          </span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email Register */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
