"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { categories } from "@/lib/data/products";

const sellerCategories = categories.filter((c) => c !== "Все");
const steps = ["Про магазин", "Категорія", "Виплати", "Перший товар", "Готово"];

export default function BecomeSellerPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");

  function next() {
    setError("");
    if (step === 0 && !shopName.trim()) {
      setError("Вкажіть назву магазину");
      return;
    }
    if (step === 1 && !category) {
      setError("Оберіть основну категорію товарів");
      return;
    }
    if (step === 2 && cardNumber.replace(/\s/g, "").length < 16) {
      setError("Вкажіть коректний номер картки для виплат");
      return;
    }
    if (step === 3 && (!productName.trim() || !productPrice)) {
      setError("Вкажіть назву і ціну першого товару");
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductPhoto(URL.createObjectURL(file));
  }

  function finish() {
    router.push("/seller/dash");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 font-sans text-text">
      <div className="w-full max-w-[480px]">
        <div className="mb-6 text-center">
          <div className="font-display text-xl font-extrabold tracking-wide">TREETEX</div>
          <div className="mt-1 text-sm font-semibold text-muted">Реєстрація продавця</div>
        </div>

        <div className="mb-6 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className="h-1.5 rounded-full"
                style={{ background: i <= step ? "var(--accent)" : "var(--surface2)" }}
              />
              <div className="mt-1.5 hidden text-center text-[10.5px] font-bold text-muted sm:block">{s}</div>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-border bg-surface p-5.5 sm:p-6.5">
          {step === 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-extrabold">Розкажіть про магазин</h2>
              <Input
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Назва магазину"
              />
              <textarea
                value={shopDesc}
                onChange={(e) => setShopDesc(e.target.value)}
                placeholder="Короткий опис магазину…"
                rows={4}
                className="resize-y rounded-[13px] border border-border bg-bg px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-text outline-none placeholder:text-muted"
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-extrabold">Основна категорія товарів</h2>
              <p className="text-[12.5px] font-semibold text-muted">
                Можна буде додати інші категорії пізніше в налаштуваннях
              </p>
              <div className="flex flex-wrap gap-2">
                {sellerCategories.map((c) => (
                  <span
                    key={c}
                    onClick={() => setCategory(c)}
                    className="cursor-pointer rounded-[10px] border-[1.5px] px-3.5 py-2 text-xs font-bold"
                    style={{
                      borderColor: category === c ? "var(--accent)" : "var(--border)",
                      background: category === c ? "var(--accent)" : "var(--surface2)",
                      color: category === c ? "#fff" : "var(--text)",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-extrabold">Реквізити для виплат</h2>
              <p className="text-[12.5px] font-semibold text-muted">
                Кошти за продані товари надходитимуть на цю картку щотижня
              </p>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Номер картки"
                inputMode="numeric"
                maxLength={19}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-extrabold">Додайте перший товар</h2>
              <label className="flex h-[110px] w-[90px] cursor-pointer items-center justify-center self-start rounded-xl border-[1.5px] border-dashed border-border bg-cover bg-center text-[11px] font-extrabold text-muted hover:border-accent hover:text-accent">
                {!productPhoto && "+ Фото"}
                {productPhoto && (
                  <div
                    className="h-full w-full rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${productPhoto})` }}
                  />
                )}
                <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
              </label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Назва товару"
              />
              <Input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Ціна, ₴"
                inputMode="numeric"
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <div className="text-[44px]">✓</div>
              <h2 className="text-lg font-extrabold">Магазин {shopName} створено!</h2>
              <p className="text-[13px] font-semibold text-muted">
                Товар «{productName}» вже додано в каталог. Можна переходити до панелі продавця.
              </p>
            </div>
          )}

          {error && <div className="mt-3 text-[12.5px] font-bold text-danger">{error}</div>}

          <div className="mt-5.5 flex gap-2.5">
            {step > 0 && step < 4 && (
              <button
                onClick={back}
                className="rounded-2xl border border-border bg-surface2 px-6 py-3.5 text-sm font-extrabold hover:border-accent"
              >
                Назад
              </button>
            )}
            {step < 4 ? (
              <Button onClick={next} className="flex-1">
                {step === 3 ? "Створити магазин" : "Далі"}
              </Button>
            ) : (
              <Button onClick={finish} className="flex-1">
                До панелі продавця
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
