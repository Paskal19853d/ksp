"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/store/AuthContext";
import { ApiError } from "@/lib/api";

const roleRedirect: Record<string, string> = {
  buyer: "/feed",
  seller: "/seller/dash",
  blogger: "/blogger/dash",
  admin: "/admin/dash",
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(roleRedirect[user.role] ?? "/feed");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не вдалося увійти");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 font-sans text-text">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center">
          <div className="font-display text-xl font-extrabold tracking-wide">TREETEX</div>
          <div className="mt-1 text-sm font-semibold text-muted">Вхід в акаунт</div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5.5">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
          />
          {error && <div className="text-[12.5px] font-bold text-danger">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Вхід…" : "Увійти"}
          </Button>
        </form>

        <div className="mt-4 text-center text-[13px] font-semibold text-muted">
          Немає акаунту?{" "}
          <Link href="/register" className="text-accent">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
