# TVOYA POSLEDNYAYA PESNYA

Единственная рабочая версия проекта теперь статическая.

## Что это

- Локальный сайт из `static-site`
- Поиск треков через Apple Music / iTunes Search API
- Превью треков прямо в браузере
- Без `Next.js`, Spotify и Supabase

## Запуск

```bash
node local-server.mjs
```

или

```bash
npm run dev
```

После этого открой:

```bash
http://localhost:3000
```

## Структура

- `local-server.mjs` — простой локальный сервер
- `static-site/index.html` — основная страница
- `static-site/styles.css` — стили
- `static-site/app.js` — поиск, превью, рейтинг и шаринг
