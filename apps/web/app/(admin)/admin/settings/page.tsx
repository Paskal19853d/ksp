"use client";

import { useState, useEffect } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminState();
  const [name, setName] = useState(settings.platformName);
  const [email, setEmail] = useState(settings.supportEmail);
  const [minWithdrawal, setMinWithdrawal] = useState(settings.minWithdrawal);

  useEffect(() => {
    setName(settings.platformName);
    setEmail(settings.supportEmail);
    setMinWithdrawal(settings.minWithdrawal);
  }, [settings.platformName, settings.supportEmail, settings.minWithdrawal]);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-5">
        <div className="mb-0.5 text-[15px] font-extrabold">Загальні налаштування</div>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Назва платформи" />
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email підтримки" />
        <Input
          value={minWithdrawal}
          onChange={(e) => setMinWithdrawal(e.target.value)}
          placeholder="Мінімальна сума виводу"
        />
        <Button onClick={() => updateSettings({ platformName: name, supportEmail: email, minWithdrawal })}>
          Зберегти зміни
        </Button>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between rounded-card border border-border bg-surface p-5">
          <div>
            <div className="text-[13.5px] font-extrabold">Режим обслуговування</div>
            <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
              Платформа стане недоступна для покупців і продавців
            </div>
          </div>
          <Switch
            checked={settings.maintenanceMode}
            onChange={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
          />
        </div>
        <div className="flex items-center justify-between rounded-card border border-border bg-surface p-5">
          <div>
            <div className="text-[13.5px] font-extrabold">Реєстрація нових продавців</div>
            <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
              Дозволити подавати заявки на створення магазину
            </div>
          </div>
          <Switch
            checked={settings.newSellerRegistration}
            onChange={() => updateSettings({ newSellerRegistration: !settings.newSellerRegistration })}
          />
        </div>
      </div>
    </div>
  );
}
