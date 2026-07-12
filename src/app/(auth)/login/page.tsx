"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Leaf, Loader2, ArrowRight, Info } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    setEmail(demoEmail);
    setPassword("password123");

    try {
      const res = await signIn("credentials", {
        email: demoEmail,
        password: "password123",
        redirect: false,
      });

      if (res?.error) {
        setError("Quick login failed.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-neutral-50 dark:bg-neutral-900">
      {/* Visual panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-neutral-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.15),transparent_40%)]" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-emerald-900/10 blur-3xl" />
        
        <div className="flex items-center gap-2.5 text-white z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">EcoSphere</span>
            <span className="text-xs block text-neutral-400">ESG Platform</span>
          </div>
        </div>

        <div className="z-10 max-w-sm">
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Measure, Improve & Gamify Corporate ESG.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            EcoSphere connects operational data, employee participation, and compliance pipelines to drive real, audit-ready change.
          </p>
        </div>

        <div className="z-10 text-xs text-neutral-500">
          &copy; 2026 EcoSphere Inc. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-neutral-950 dark:text-white">EcoSphere</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Sign in to manage your organization's ESG metrics.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
              >
                Work Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={loading}
                className="w-full px-3.5 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-3.5 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Roles Quick Login
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Admin", email: "admin@ecosphere.dev", role: "admin" },
                { name: "Sustainability Manager", email: "manager@ecosphere.dev", role: "manager" },
                { name: "Employee User", email: "employee@ecosphere.dev", role: "employee" },
                { name: "External Auditor", email: "auditor@ecosphere.dev", role: "auditor" },
              ].map((role) => (
                <button
                  key={role.email}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin(role.email)}
                  className="p-3 text-left border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-900 rounded-lg hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all text-xs cursor-pointer group"
                >
                  <span className="block font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {role.name}
                  </span>
                  <span className="block text-[10px] text-neutral-400 truncate mt-0.5">
                    {role.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
