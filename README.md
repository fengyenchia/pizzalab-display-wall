# PIZZALAB Display Wall

PIZZALAB 的拍立得成果展示牆

## 開始使用

```bash
pnpm install
pnpm dev
```

前端預設位於 `http://localhost:3000`。

## 本機後端

專案包含不需額外套件的 Python 後端，預設讀取
`data/sessions.json` 與 `data/photos/`：

```bash
python server.py
```

後端位於 `http://localhost:8787`，提供：

```text
GET /api/ping
GET /api/sessions
GET /api/sessions/{id}
GET /photos/{filename}
```

前端連接本機後端的 `.env.local`：

```env
API_URL=http://localhost:8787
USE_MOCK_DATA=false
```

正式環境可透過 `PIZZALAB_DATA_DIR` 指向 Unity 的資料目錄：

```env
PIZZALAB_DATA_DIR=C:\path\to\Data
```
