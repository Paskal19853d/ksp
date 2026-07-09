"use client";

import { useState } from "react";
import { useSellerState } from "@/lib/store/SellerStateContext";
import { avatarUrl, teamRolePermissions, type TeamRole } from "@/lib/data/seller";

const roles: TeamRole[] = ["Власник", "Менеджер", "Оператор", "Аналітик"];

export default function SellerTeamPage() {
  const { team, inviteMember, setMemberRole, removeMember } = useSellerState();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("Оператор");

  function handleInvite() {
    inviteMember(email, role);
    setEmail("");
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-2.5">
        <div className="mb-0.5 text-[15px] font-extrabold">Учасники команди</div>
        {team.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface p-4">
            <img src={avatarUrl(m.av)} alt={m.name} className="h-11 w-11 rounded-2xl object-cover" />
            <div className="min-w-[160px] flex-[2]">
              <div className="text-[13px] font-extrabold">{m.name}</div>
              <div className="text-[11.5px] font-semibold text-muted">{m.email}</div>
              <div className="mt-0.5 text-[11px] font-semibold text-muted">з {m.joined}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <span
                  key={r}
                  onClick={() => setMemberRole(m.id, r)}
                  className="cursor-pointer rounded-[10px] border-[1.5px] px-3 py-1.5 text-[11px] font-bold"
                  style={{
                    borderColor: m.role === r ? "var(--accent)" : "var(--border)",
                    background: m.role === r ? "var(--accent)" : "var(--surface2)",
                    color: m.role === r ? "#fff" : "var(--text)",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
            {m.role !== "Власник" && (
              <button
                onClick={() => removeMember(m.id)}
                className="ml-auto rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-danger hover:text-danger"
              >
                Видалити
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 self-start rounded-card border border-border bg-surface p-5">
        <div className="text-[15px] font-extrabold">Запросити співробітника</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email співробітника"
          className="rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {roles.filter((r) => r !== "Власник").map((r) => (
            <span
              key={r}
              onClick={() => setRole(r)}
              className="cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-2 text-xs font-bold"
              style={{
                borderColor: role === r ? "var(--accent)" : "var(--border)",
                background: role === r ? "var(--accent)" : "var(--surface2)",
                color: role === r ? "#fff" : "var(--text)",
              }}
            >
              {r}
            </span>
          ))}
        </div>
        <div className="text-[11.5px] font-semibold leading-relaxed text-muted">
          {teamRolePermissions[role]}
        </div>
        <button
          onClick={handleInvite}
          className="rounded-xl bg-accent py-3.5 text-[13.5px] font-extrabold text-white hover:brightness-110"
        >
          Надіслати запрошення
        </button>
      </div>
    </div>
  );
}
