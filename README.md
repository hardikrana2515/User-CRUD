# User CRUD

A full-stack user management application built with **FastAPI**, **React**, and **Supabase**. Create, read, update, and delete users through a clean dashboard interface backed by a PostgreSQL database.

---

## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React 19, Vite 8, Tailwind CSS 4       |
| Backend    | FastAPI, Pydantic v2, Uvicorn           |
| Database   | Supabase (PostgreSQL)                   |
| Icons      | Phosphor Icons                          |
| Deployment | Docker, Nginx, Supervisor               |

---

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Search users by ID
- Filter users by role (Admin, Member, Viewer)
- Paginated user table
- Email uniqueness validation
- Confirmation modal for delete with ID verification
- Toast notifications for success and error states
- Responsive design

---

## Project Structure

```
User-CRUD/
├── Backend/
│   ├── main.py              # FastAPI application and routes
│   ├── schema.py            # Pydantic models (User, Create_user, Update_user)
│   ├── db.py                # Supabase client initialization
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (not committed)
├── Frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── api.js           # API client for backend communication
│   │   └── components/
│   │       ├── UserTable.jsx
│   │       ├── CreateUserModal.jsx
│   │       ├── EditUserModal.jsx
│   │       ├── DeleteConfirmModal.jsx
│   │       └── Toast.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Dockerfile               # Multi-stage build
├── docker-compose.yml
├── nginx.conf               # Reverse proxy configuration
├── supervisord.conf          # Process manager for production
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- A [Supabase](https://supabase.com) project with a `users` table

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/User-CRUD.git
cd User-CRUD
```

### 2. Backend Setup

```bash
cd Backend

# Create and activate virtual environment
python -m venv myenv
myenv\Scripts\activate        # Windows
# source myenv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `Backend/.env` file:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
URL=["http://localhost:5173"]
```

Start the backend:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `Frontend/.env` file:

```env
VITE_API_BASE=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method   | Endpoint           | Description         |
| -------- | ------------------ | ------------------- |
| `GET`    | `/`                | Welcome message     |
| `GET`    | `/health`          | Health check        |
| `GET`    | `/api/users/`      | Get all users       |
| `GET`    | `/api/users/{id}`  | Get user by ID      |
| `POST`   | `/api/users/`      | Create a new user   |
| `PUT`    | `/api/users/{id}`  | Update a user       |
| `DELETE` | `/api/users/{id}`  | Delete a user       |

---

## Docker Deployment

### Build and Run (Full-Stack)

```bash
docker build -t user-crud .
docker run -p 80:80 --env-file Backend/.env user-crud
```

Access the app at `http://localhost`.

### Docker Compose

```bash
docker compose up --build
```

### Push to Docker Hub

```bash
docker tag user-crud YOUR_DOCKERHUB_USERNAME/user-crud:latest
docker push YOUR_DOCKERHUB_USERNAME/user-crud:latest
```

---

## Supabase Table Schema

Create a `users` table in your Supabase project:

| Column      | Type        | Default           |
| ----------- | ----------- | ----------------- |
| `id`        | int8        | Auto-increment    |
| `name`      | text        |                   |
| `email`     | text        | Unique            |
| `role`      | text        |                   |
| `createdAt` | timestamptz | `now()`           |
| `updatedAt` | timestamptz | `now()`           |

---

## License

This project is open source and available under the [MIT License](LICENSE).
