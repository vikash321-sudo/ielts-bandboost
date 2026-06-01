"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [fullName, setFullName] = useState("");
  const [targetBand, setTargetBand] = useState("7.0");
  const [targetCountry, setTargetCountry] = useState("");

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

    if (mode === "signup" && !fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    setLoading(true);

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                target_band: targetBand,
                target_country: targetCountry
              }
            }
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
      if (result.data.session) {
        router.push("/diagnostic");
        router.refresh();
        return;
      }

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
    <div className="mx-auto max-w-md space-y-6 px-1">
      <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-3xl font-black">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {mode === "login"
            ? "Login to continue your IELTS progress."
            : "Create your IELTS profile first. Then complete a diagnostic test."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <>
              <div>
                <label className="text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Target Band</label>
                <select
                  value={targetBand}
                  onChange={(event) => setTargetBand(event.target.value)}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
                >
                  <option value="5.5">5.5</option>
                  <option value="6.0">6.0</option>
                  <option value="6.5">6.5</option>
                  <option value="7.0">7.0</option>
                  <option value="7.5">7.5</option>
                  <option value="8.0">8.0</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Target Country <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
                  value={targetCountry}
                  onChange={(event) => setTargetCountry(event.target.value)}
                  placeholder="Australia, UK, Canada..."
                />
              </div>
            </>
          ) : null}

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