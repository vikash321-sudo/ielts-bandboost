"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Check your .env.local file.");
      return;
    }

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setLoading(true);

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password
          })
        : await supabase.auth.signInWithPassword({
            email,
            password
          });

    setLoading(false);

    if (result.error) {
      setErrorMessage(result.error.message);
      return;
    }

    if (mode === "signup") {
      setMessage(
        "Account created. If email confirmation is enabled, check your email before logging in."
      );
      setMode("login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Login to save your IELTS practice progress online.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
            setErrorMessage("");
          }}
          className="mt-5 text-sm font-bold text-slate-700 hover:text-slate-950"
        >
          {mode === "login"
            ? "New student? Create account"
            : "Already have an account? Login"}
        </button>
      </section>
    </div>
  );
}