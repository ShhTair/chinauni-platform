# ChinaUni Platform

Гид по поступлению в китайские университеты для студентов из Казахстана и СНГ.

## Stack

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy + Alembic
- **Frontend**: React + Vite + TypeScript + Tailwind + Framer Motion

## Быстрый старт

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # заполнить DATABASE_URL и SECRET_KEY

# Создать базу данных
createdb chinauni

# Инициализировать (авто-создание таблиц при первом запуске)
uvicorn app.main:app --reload --port 8000

# Заполнить тестовыми данными (70 университетов)
python -m seeds.universities
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Структура

```
chinauni/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + routers
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   └── services/        # Auth, email
│   └── seeds/
│       └── universities.py  # 70 universities seed
└── frontend/
    └── src/
        ├── pages/           # All page components
        ├── components/      # UI, layout, universities, map
        ├── stores/          # Zustand (auth, filters, compare)
        └── lib/             # API client, utils, protection
```

## API Docs

После запуска бэкенда: http://localhost:8000/api/docs

## Деплой

- Backend: Railway / Render (free tier достаточно)
- Frontend: Vercel (`vercel deploy`)
- DB: Railway PostgreSQL или Supabase
