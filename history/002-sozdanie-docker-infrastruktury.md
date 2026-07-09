# 002 — Создание Docker-инфраструктуры (Next.js + NestJS + PostgreSQL)

Дата: 2026-07-08

## Контекст

После решения о стеке ([001](001-vybor-stack-docker-nextjs-nestjs.md)) пользователь уточнил, что начинать нужно только с инфраструктуры — Docker и пустые каркасы приложений, без переноса дизайна на этом шаге.

## Решение

Собрать монорепо из трёх частей (`apps/web`, `apps/api`, `packages/shared`) и поднять их через единый `docker-compose.yml` с тремя сервисами (`web`, `api`, `db`), в dev-режиме с hot reload через volume-mount исходников.

## Изменения

- `package.json` (корневой) — npm workspaces (`apps/*`, `packages/*`)
- `packages/shared/src/index.ts` — общие TS-интерфейсы `Product`, `User`, `Order`, `Stream`
- `apps/web` — Next.js App Router каркас (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`), Tailwind CSS настроен (`tailwind.config.ts`, `postcss.config.js`), `Dockerfile.dev`
- `apps/api` — NestJS каркас (`src/main.ts`, `src/app.module.ts`, `src/app.controller.ts` с `GET /health`), TypeORM подключение к Postgres, `Dockerfile.dev`
- `docker-compose.yml` — сервисы `db` (postgres:16-alpine, healthcheck), `api` (порт 4000, зависит от healthy `db`), `web` (порт 3000, зависит от `api`)
- `.env.example`, `.gitignore`

## Результат проверки

`docker compose build` и `docker compose up -d` — все три контейнера поднялись и стали healthy/running. Проверено вживую через `curl`:
- `GET http://127.0.0.1:4000/health` → `{"status":"ok"}` (NestJS + TypeORM успешно подключился к Postgres)
- `GET http://127.0.0.1:3000/` → HTTP 200, рендерится "TREETEX web is running"

Примечание: на этой машине `curl localhost` резолвится в IPv6 (`::1`), где Docker Desktop не слушает — рабочий адрес для локальной проверки `127.0.0.1`, не `localhost`.

Отдельно после этого шага был обновлён Next.js с 14.2.5 (известная уязвимость, патч в 14.2.35) до актуального стабильного 16.2.10 — React 18.3.1 оставлен без изменений (совместим). При обновлении потребовалось удалить и пересоздать именованный Docker-volume `ksp_web_node_modules`, так как он держал закэшированные `node_modules` от первой сборки поверх нового образа.
