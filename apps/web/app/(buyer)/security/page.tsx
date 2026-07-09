"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppState } from "@/lib/store/AppStateContext";

const sessions = [
  { device: "Chrome · Windows", location: "Київ, Україна", current: true },
  { device: "TREETEX App · iPhone 15", location: "Київ, Україна", current: false },
];

export default function SecurityPage() {
  const { showToast } = useAppState();
  const [twoFA, setTwoFA] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  function changePassword() {
    if (!oldPass || newPass.length < 6) {
      showToast("Пароль має містити щонайменше 6 символів");
      return;
    }
    setOldPass("");
    setNewPass("");
    showToast("Пароль оновлено ✓");
  }

  function endSession(device: string) {
    showToast(`Сеанс "${device}" завершено`);
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-[120px]">
      <div className="flex items-center gap-2.5 py-4">
        <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          ←
        </Link>
        <h1 className="m-0 text-xl font-extrabold">Безпека</h1>
      </div>

      <h2 className="mb-2.5 text-base font-extrabold">Зміна пароля</h2>
      <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-4.5">
        <Input
          type="password"
          placeholder="Поточний пароль"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Новий пароль"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <Button onClick={changePassword}>Змінити пароль</Button>
      </div>

      <div className="mt-3.5 flex items-center justify-between rounded-card border border-border bg-surface p-4.5">
        <div>
          <div className="text-[13.5px] font-extrabold">Двофакторна автентифікація</div>
          <div className="mt-0.5 text-[11.5px] font-semibold text-muted">Додатковий захист входу через SMS-код</div>
        </div>
        <button
          onClick={() => {
            setTwoFA((v) => !v);
            showToast(twoFA ? "2FA вимкнено" : "2FA увімкнено ✓");
          }}
          className="h-7 w-12 flex-none rounded-full transition-colors"
          style={{ background: twoFA ? "var(--accent)" : "var(--surface2)" }}
        >
          <span
            className="block h-5 w-5 rounded-full bg-white transition-transform"
            style={{ transform: twoFA ? "translateX(24px)" : "translateX(4px)" }}
          />
        </button>
      </div>

      <h2 className="mb-2.5 mt-5.5 text-base font-extrabold">Активні сеанси</h2>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {sessions.map((s) => (
          <div
            key={s.device}
            className="flex items-center justify-between border-b border-border px-4.5 py-3.5 last:border-0"
          >
            <div>
              <div className="text-[13px] font-extrabold">
                {s.device} {s.current && <span className="text-[11px] font-bold text-success">· цей пристрій</span>}
              </div>
              <div className="text-[11.5px] font-semibold text-muted">{s.location}</div>
            </div>
            {!s.current && (
              <button
                onClick={() => endSession(s.device)}
                className="text-[12.5px] font-bold text-danger"
              >
                Завершити
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
