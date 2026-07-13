# 007 — Admin Users/Sellers: реальный backend + одобрение продавцов

Дата: 2026-07-12

## Контекст

После завершения дорожной карты ENGINE.md §9 (включая видео-модуль) и подключения `admin/categories` к API, разведка показала, что `admin/dash`, `admin/users`, `admin/sellers`, `admin/live`, `admin/settings` всё ещё полностью на моках (`AdminStateContext`). Выбрана пара `admin/users` + `admin/sellers` как наиболее фундаментальная — остальное (дашборд, live-оверсайт) опирается на реальных пользователей/продавцов.

Разведка вскрыла более серьёзный пробел, чем просто "подключить экран к API": сейчас **любой** может зарегистрироваться как `seller` без какого-либо одобрения — концепции `sellerStatus`/pending-состояния не существует нигде в backend, хотя мок `admin/sellers` показывает очередь одобрения новых продавцов как реальную функцию продукта.

## Решение

Через `AskUserQuestion` пользователь подтвердил:
- Нужен реальный approval-гейт для новых продавцов (не визуальная имитация) — новый seller регистрируется в статусе `pending` и не может создавать товары, пока admin не одобрит.
- Существующие 5 продавцов (technohub/styleway/glowup/homelab + реальный аккаунт пользователя) должны получить `approved` через backfill прямо в миграции — не остаться заблокированными задним числом.
- Поле `storeCategory` (категория магазина) в форму регистрации сейчас **не добавляется** — остаётся `null`, админка показывает «—» (мок предполагал его, но отдельная форма ввода не оправдана сейчас).
- Нужен путь **отзыва** уже одобренного продавца — реализован тем же `resolve`-эндпоинтом, без запрета на повторный вызов (в отличие от `ModerationService.resolve`, который запрещает повторное разрешение уже решённых репортов). Одна кнопка в списке всех продавцов может как одобрить, так и отозвать одобрение в любой момент.

**Данные — прямо на `UserEntity`, без отдельной `SellerProfileEntity`**: единственные персистентные seller-специфичные поля — `sellerStatus` и `storeCategory`. Остальные показатели мока (`revenue`, `products`, `rating`) — чистые агрегаты над Orders/Products, не хранятся отдельно (иначе разъедутся с реальностью).

**Гейт**: `JwtStrategy.validate()` уже перезапрашивал пользователя из БД на каждый authenticated-запрос (для проверки `blocked`) — тот же механизм расширен на `sellerStatus`, поэтому одобрение/блокировка вступают в силу немедленно на следующий запрос, без отзыва токена.

## Изменения

**Backend**:
- `apps/api/src/users/entities/user.entity.ts` — новые колонки `sellerStatus` (`pending`|`approved`|`rejected`|null), `storeCategory` (nullable)
- `apps/api/src/users/dto/` (новая папка) — `query-users.dto.ts`, `resolve-seller.dto.ts`, `set-blocked.dto.ts`
- `apps/api/src/users/users.service.ts` — новые методы: `findAllForAdmin` (пагинация/фильтр по роли и поиску), `setBlocked`, `findPendingSellers`, `findAllSellersForAdmin` (агрегация revenue через `SellerStatsService.getRevenueTotals`, product count/rating через grouped-запрос к `ProductEntity`), `resolveSeller` (многоразовый, без запрета повтора). Добавлен приватный `sanitize()` — во всех admin-ответах теперь вырезается `passwordHash` (найдено и исправлено как утечка в процессе живого тестирования)
- `apps/api/src/users/users.controller.ts` (новый файл — у модуля не было контроллера) — 5 роутов под `/users/admin/*`, все `@Roles("admin")`
- `apps/api/src/users/users.module.ts` — добавлен контроллер, `ProductEntity`, импорт `OrdersModule`
- `apps/api/src/orders/orders.module.ts` — `SellerStatsService` добавлен в `exports`
- `apps/api/src/orders/seller-stats.service.ts` — новый метод `getRevenueTotals(sellerIds)` (grouped-запрос по нескольким продавцам сразу, без bucketing по периоду — отдельно от существующего `getStats` для одного продавца с графиком)
- `apps/api/src/auth/auth.service.ts`, `apps/api/src/auth/strategies/jwt.strategy.ts` — `sellerStatus` добавлен в возвращаемые объекты пользователя
- `apps/api/src/products/products.controller.ts` — гейт в `create()`: `sellerStatus !== "approved"` → `ForbiddenException` с разным текстом для pending/rejected
- Миграция `1783872159169-AddSellerApproval.ts` — добавление колонок + `UPDATE users SET "sellerStatus" = 'approved' WHERE role = 'seller'` (backfill), стандартная вырезка спурьезного searchVector-diff

**Frontend**:
- `packages/shared/src/index.ts` — `User` расширен `sellerStatus`/`storeCategory`/`createdAt`, новые типы `AdminUserListResponse`, `AdminSeller`
- `apps/web/lib/data/useAdminUsers.ts` (новый) — `useAdminUsers()` + `roleLabel()`
- `apps/web/lib/data/useAdminSellers.ts` (новый) — `usePendingSellers()`, `useAllSellersAdmin()`, `sellerStatusLabel()`, `formatRevenue()`
- `apps/web/app/(admin)/admin/users/page.tsx` — реальный список, фильтр по роли, поиск, блокировка через реальный `blocked`
- `apps/web/app/(admin)/admin/sellers/page.tsx` — очередь pending + полный список с реальными revenue/products/rating, кнопка "Відкликати" для отзыва уже одобренных

## Результат проверки

Полное живое тестирование через прямые HTTP-запросы: регистрация продавца → `sellerStatus: "pending"` → попытка создать товар → 403 с корректным сообщением → admin одобряет → pending-список пуст → тот же продавец (без повторного логина) теперь может создать товар (подтверждает живую перепроверку статуса без отзыва токена) → повторный `resolve` в "rejected" на уже approved продавце → подтверждено, что это разрешено (отзыв) и создание товара снова блокируется.

Отдельно протестирована блокировка: заблокированный пользователь получает 401 на следующий запрос с уже имеющимся токеном (без разлогина), и на попытку нового логина — с корректным сообщением; разблокировка восстанавливает доступ.

Найдена и устранена утечка `passwordHash` в ответах `/users/admin/*` — обнаружена при первом же живом вызове `GET /users/admin/sellers/pending`, исправлена добавлением `sanitize()` до дальнейшего тестирования.

Проверка через Playwright в реальном браузере: `/admin/users` и `/admin/sellers` рендерятся без ошибок консоли на реальных данных; клик "Схвалити" на тестовом продавце через настоящий UI корректно переместил его из очереди в список одобренных с тостом подтверждения. Все тестовые аккаунты и продукты удалены после проверки, база данных подтверждена в чистом состоянии (5 исходных продавцов, все `approved`).
