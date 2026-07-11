"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/store/AuthContext";
import { ApiError } from "@/lib/api";

const roles: { value: "buyer" | "seller" | "blogger"; label: string }[] = [
  { value: "buyer", label: "Покупець" },
  { value: "seller", label: "Продавець" },
  { value: "blogger", label: "Блогер" },
];

const roleRedirect: Record<string, string> = {
  buyer: "/feed",
  seller: "/seller/dash",
  blogger: "/blogger/dash",
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller" | "blogger">("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register({ name, email, password, role });
      router.push(roleRedirect[user.role] ?? "/feed");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не вдалося зареєструватися");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 font-sans text-text">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center">
          <div className="font-display text-xl font-extrabold tracking-wide">TREETEX</div>
          <div className="mt-1 text-sm font-semibold text-muted">Реєстрація</div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5.5">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ім'я"
            required
          />
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
            placeholder="Пароль (мінімум 8 символів)"
            required
          />

          <div className="flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <span
                key={r.value}
                onClick={() => setRole(r.value)}
                className="cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-2 text-xs font-bold"
                style={{
                  borderColor: role === r.value ? "var(--accent)" : "var(--border)",
                  background: role === r.value ? "var(--accent)" : "var(--surface2)",
                  color: role === r.value ? "#fff" : "var(--text)",
                }}
              >
                {r.label}
              </span>
            ))}
          </div>

          {error && <div className="text-[12.5px] font-bold text-danger">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Реєстрація…" : "Зареєструватися"}
          </Button>
        </form>

        <div className="mt-4 text-center text-[13px] font-semibold text-muted">
          Вже є акаунт?{" "}
          <Link href="/login" className="text-accent">
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
