# LifeOS-AI

> **Don't ask AI what to do. Let AI find what you're about to miss.**

LifeOS-AI is a privacy-first personal context intelligence system designed to help users understand their personal context and make better use of information across their daily lives.

The project consists of a **Next.js frontend** and a **FastAPI backend**, with PostgreSQL used for persistent data storage and Google Gemini used as the AI provider.

---

## ✨ Features

* 🤖 AI-powered personal context intelligence
* 🧠 Privacy-first approach to personal information
* ⚡ Next.js-based frontend
* 🚀 FastAPI backend
* 🗄️ PostgreSQL database
* 🔐 JWT-based authentication infrastructure
* 🌐 Configurable CORS support
* 🔑 Gemini API integration
* 🐳 Docker Compose support for PostgreSQL
* ❤️ Backend health-check endpoint
* 🔧 Environment-based configuration

> **Note:** LifeOS-AI is currently under active development. Some integrations and features may still be incomplete or experimental.

---

## 🏗️ Architecture

LifeOS-AI follows a frontend/backend architecture:

```text
                    ┌──────────────────────┐
                    │      User / Browser   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Next.js          │
                    │      Frontend        │
                    │     Port: 3000       │
                    └──────────┬───────────┘
                               │
                         HTTP / API
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │       Backend        │
                    │      Port: 8000      │
                    └───────┬───────┬──────┘
                            │       │
                   ┌────────┘       └────────┐
                   ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │   PostgreSQL    │       │   Google Gemini │
          │     Database    │       │   AI Provider   │
          └─────────────────┘       └─────────────────┘
```

---

## 📁 Project Structure

```text
LifeOS-AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   └── ...
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .env.example
├── docker-compose.yml
├── vercel.json
├── .gitignore
└── README.md
```

### Frontend

The frontend is built using:

* Next.js
* React
* TypeScript
* Tailwind CSS

The frontend development server runs on port `3000` by default.

### Backend

The backend is built using:

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Alembic
* PostgreSQL
* Pydantic Settings
* Google Gemini

The backend API runs on port `8000` by default.

---

## 🛠️ Prerequisites

Before running the project locally, install:

* **Git**
* **Node.js** and npm
* **Python 3**
* **PostgreSQL** or Docker
* A **Google Gemini API key**

The frontend currently uses Next.js `16.3.3`, React `19.2.8`, and TypeScript `^5`.

The backend dependencies include FastAPI, Uvicorn, SQLAlchemy, asyncpg, Alembic, Pydantic Settings, JWT authentication support, and the Google GenAI SDK.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/ANU5565/LifeOS-AI.git
cd LifeOS-AI
```

---

## 2. Configure environment variables

Create a `.env` file from the provided example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The repository provides configuration for:

```env
DATABASE_URL=postgresql+asyncpg://lifeos:lifeos_dev@localhost:5432/lifeos_db

SECRET_KEY=your-secret-key-change-this-in-production

ACCESS_TOKEN_EXPIRE_MINUTES=30

GEMINI_API_KEY=your-gemini-api-key

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_API_URL=http://localhost:8000

CORS_ORIGINS=http://localhost:3000
```

The `.env.example` file contains the project's current database, security, AI provider, Google OAuth, frontend API, and CORS configuration.

### Important

Never commit your real `.env` file or API credentials to GitHub.

Generate a strong `SECRET_KEY` for non-development environments and provide your own Gemini API key.

---

# 🐍 Backend Setup

## 3. Create a virtual environment

From the repository root:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Install backend dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Start the backend

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

The API should now be available at:

```text
http://localhost:8000
```

FastAPI automatically provides interactive API documentation at:

```text
http://localhost:8000/docs
```

---

## 6. Check backend health

LifeOS-AI provides a health endpoint:

```text
GET /health
```

Open:

```text
http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "lifeos-ai",
  "version": "0.1.0"
}
```

The current backend implementation exposes this endpoint for connectivity and monitoring checks.

---

# ⚛️ Frontend Setup

Open another terminal and return to the repository root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

The frontend currently defines the following npm scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

# 🐘 Database Setup

LifeOS-AI uses PostgreSQL.

The default development configuration is:

```text
Host: localhost
Port: 5432
Database: lifeos_db
Username: lifeos
Password: lifeos_dev
```

For local development, PostgreSQL can be started using the included Docker Compose configuration.

---

# 🐳 Docker Setup

The repository includes a `docker-compose.yml` configuration for PostgreSQL using the `postgres:16-alpine` image.

From the project root, run:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

The PostgreSQL service exposes:

```text
localhost:5432
```

To stop the services:

```bash
docker compose down
```

To stop the services and remove the database volume:

```bash
docker compose down -v
```

> **Warning:** Removing the volume deletes the PostgreSQL data stored in that Docker volume.

---

# 🔄 Running the Complete Application

For local development, you can run the database, backend, and frontend separately.

### Terminal 1 — Database

From the project root:

```bash
docker compose up -d
```

### Terminal 2 — Backend

```bash
cd backend

# Activate your virtual environment first

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

### Terminal 3 — Frontend

```bash
cd frontend

npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🔐 Environment Variables

| Variable                      | Purpose                              |
| ----------------------------- | ------------------------------------ |
| `DATABASE_URL`                | PostgreSQL connection string         |
| `SECRET_KEY`                  | Application security/signing key     |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT access-token lifetime            |
| `GEMINI_API_KEY`              | Google Gemini API authentication     |
| `GOOGLE_CLIENT_ID`            | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth client secret           |
| `NEXT_PUBLIC_API_URL`         | Backend API URL used by the frontend |
| `CORS_ORIGINS`                | Allowed frontend origins             |

Google OAuth variables are currently reserved for the Calendar integration work identified in the project configuration.

---

# 🧪 Development

Before submitting changes, run the available checks.

### Frontend lint

```bash
cd frontend
npm run lint
```

### Frontend production build

```bash
npm run build
```

### Backend

Make sure the backend starts successfully:

```bash
uvicorn app.main:app --reload --port 8000
```

Then verify:

```text
http://localhost:8000/health
```

---

# 🤝 Contributing

Contributions are welcome!

To contribute:

1. Fork the repository.
2. Clone your fork.
3. Create a new branch.

```bash
git checkout -b feature/your-feature-name
```

4. Make your changes.
5. Test the changes locally.
6. Commit your changes.

```bash
git add .
git commit -m "feat: describe your change"
```

7. Push your branch.

```bash
git push origin feature/your-feature-name
```

8. Open a Pull Request against the `main` branch.

### Contribution Guidelines

* Keep changes focused on the relevant issue.
* Avoid changing existing functionality unnecessarily.
* Follow the existing project structure and coding style.
* Do not commit secrets or `.env` files.
* Test your changes before opening a Pull Request.
* Clearly describe what was changed in the Pull Request.

---

# 🐛 Reporting Issues

If you find a bug or have a feature request, please open an issue with:

* A clear title
* Description of the problem or proposed feature
* Steps to reproduce, if applicable
* Expected behaviour
* Actual behaviour
* Relevant logs or screenshots

---
* 🚀 About
* ✨ Features
* 🏗️ Architecture
* 🛠️ Tech Stack
* 📂 Project Structure
* ⚙️ Installation
* 🔐 Environment Variables
* ▶️ Running Locally
* 🧪 Testing
* 🤝 Contributing
* 🐛 Issues
* 🔀 Pull Requests
* 📜 License
* 🛡️ Code of Conduct
* 🔒 Security
* 💬 Support
* 🌟 Contributors

---

# 📌 Project Status

LifeOS-AI is an actively developing project.

The current repository establishes the frontend, backend, database configuration, environment configuration, and foundational API structure. Additional personal-context intelligence and integrations can be developed as the project evolves.

---

# 📄 License

If a license is added to the repository, this section should be updated with the corresponding license information.

---

## 🙌 Acknowledgements

Built and maintained by the LifeOS-AI contributors.

If you find the project useful, consider giving the repository a ⭐ on GitHub.
