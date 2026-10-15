"use client";

import { useState } from "react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? `Login failed (${res.status})`);
        setLoading(false);
        return;
      }
      // Hard reload so the server component re-reads the new session cookie
      window.location.href = "/admin";
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <form onSubmit={submit} className="card">
        <h1 className="t-heading-sm text-ink-deep mb-2">Admin login</h1>
        <p className="t-body-sm text-steel mb-6">
          Sign in with your admin account to manage meetups and media.
        </p>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`input ${error ? "input-error" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@saqib.dev"
          autoFocus
          autoComplete="username"
        />
        <label className="label mt-4" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`input ${error ? "input-error" : ""}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {error && (
          <p className="t-body-sm text-critical-strong mt-2">{error}</p>
        )}
        <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
