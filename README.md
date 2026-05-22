# Flag Oracle

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Flag Oracle** is a full-stack web application built around a flag-guessing game. The goal is simple: you are shown a flag image and must type the correct country name before the timer runs out. Each game consists of exactly 5 flags drawn at random from the full database, so no two sessions play exactly the same.

### Game Modes

The game offers three difficulty modes, each with a different time limit per flag and a different score multiplier applied to every correct answer:

- **Normal** — the most forgiving mode, with a generous timer and a base multiplier. Ideal for learning flags or warming up.
- **Hard** — a tighter timer forces faster recall. The higher multiplier rewards players who can keep up the pace.
- **Hardcore** — minimal time per flag and the highest multiplier. One wrong guess or a timeout burns through the clock fast; only players with strong flag knowledge will score well here.

Choosing a harder mode is a deliberate risk/reward trade-off: the shorter window makes it easier to run out of time, but every correct answer is worth significantly more points.

### Scoring and Rankings

Points are calculated per correct answer and scaled by the mode's multiplier. At the end of each five-flag session the game shows a summary screen with your score and the correct answers for any flags you missed.

Scores feed two independent ranking systems:

- **Per-mode leaderboard** — the top ten scores recorded inside each specific mode (Normal, Hard, Hardcore).
- **Global leaderboard** — the top ten players ranked by their cumulative score across all modes combined.

### User System

Players register with a username and password. The backend stores each user's best score per mode and their aggregate global score. Scores are updated automatically after every completed game session, so the leaderboards always reflect the latest results without any manual action from the player.

## Technologies used

**Frontend**

1. React JS
2. TypeScript
3. CSS3
4. HTML5
5. Vite

**Backend**

1. Python → Flask

**Database**

1. MongoDB → PyMongo

**Deploy**

1. Docker
2. Nginx
3. Gunicorn

## Libraries used

### Frontend

#### Dependencies

```
"react": "^19.2.4"
"react-dom": "^19.2.4"
"react-router-dom": "7.13.2"
"react-icons": "^4.4.0"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/react": "^16.0.1"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/react": "^19.2.14"
"@types/react-dom": "^19.2.3"
"@vitejs/plugin-react": "^5.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.5.5"
"eslint-plugin-react-hooks": "^5.0.0"
"eslint-plugin-react-refresh": "^0.4.0"
"globals": "^15.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"msw": "2.10.4"
"prettier": "^3.0.0"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"undici": "^7.25.0"
"vite": "^7.1.6"
```

### Backend

#### Runtime (`[project.dependencies]`)

```
flask==3.1.3
pymongo==4.16.0
pydantic==2.11.9
werkzeug==3.1.6
gunicorn==23.0.0
```

#### Dev (`[project.optional-dependencies]` dev)

```
pip-audit==2.7.3
ruff==0.11.12
mypy==1.13.0
```

#### Test (`[project.optional-dependencies]` test)

```
pytest==9.0.3
pytest-env==1.1.5
pytest-cov==4.1.0
pytest-timeout==2.3.1
pytest-xdist==3.5.0
```

## Getting Started

These steps prepare a local working copy. The stack itself runs through Docker — see the [Production](#production) section for the compose commands that actually boot it.

1. Clone the repository: `git clone "repository link"`.
2. Install the frontend dependencies — from `flag-oracle-app/` run `npm install` (or `yarn install`).
3. Set up the backend virtual environment — from `flag-oracle-api/`. Dependencies are declared in `pyproject.toml`; the `requirements*.txt` files are thin pointers (`-e .`, `-e .[dev]`, `-e .[test]`) kept for tooling that still expects them:

   ```bash
   python -m venv venv
   venv\Scripts\activate            # Windows
   # source venv/bin/activate       # macOS/Linux
   pip install -e ".[dev,test]"
   ```

4. Create the `.env` files for both `flag-oracle-app/` and `flag-oracle-api/` using the variables documented in the [Env Keys](#env-keys) section. Without them the containers will fail to start with missing-config errors.
5. Install **Docker Desktop** (required on Windows). With everything in place, jump to [Production → Development](#development) to launch the stack.

### Pre-Commit (Monorepo)

The repository uses a **single git hook at `.githooks/pre-commit`** that orchestrates both sub-projects based on which files are staged:

- When `flag-oracle-api/` files are staged → runs `ruff` (lint + format) and `mypy` against the backend, invoked directly from the `flag-oracle-api/venv/` interpreter.
- When `flag-oracle-app/` files are staged → runs `lint-staged` (ESLint + Prettier) inside the frontend.

The hook becomes active once `core.hooksPath` is pointed at `.githooks/`. Running `npm install` inside `flag-oracle-app/` performs this configuration automatically via the `prepare` script. To do it manually:

```bash
git config core.hooksPath .githooks
```

To trigger the checks without committing, run the hook directly:

```bash
sh .githooks/pre-commit
```

## Env Keys

The application reads its configuration from `.env` files. Below is the reference for every variable consumed by the frontend and the backend.

1. `TZ`: Timezone setting for the container.
2. `VITE_API_URL`: Base URL of the backend API the frontend consumes.
3. `MONGO_HOST`: Hostname or address where the MongoDB server is located. `host.docker.internal` lets a Docker container reach the host machine.
4. `MONGO_PORT`: Port on which MongoDB listens. The default is `27017`.
5. `MONGO_USER`: Username used to authenticate against MongoDB.
6. `MONGO_PASS`: Password for the user specified in `MONGO_USER`.
7. `MONGO_DB_NAME`: Name of the database the application connects to.
8. `MONGO_AUTH_SOURCE`: Database where the user credentials are verified. Typically `admin` when the user was created there.
9. `HOST`: Network interface the backend API binds to (e.g. `0.0.0.0` to allow external connections).
10. `PORT`: Port on which the backend API is exposed.
11. `MAX_CONTENT_LENGTH`: Maximum allowed request body size in bytes. Defaults to `1048576` (1 MB).
12. `SEED_DEFAULT_DATA`: When `true`, seeds MongoDB with the default flag catalogue and game modes on first startup. Enabled in development, disabled in production.

```ts
# Frontend Envs
TZ=America/Argentina/Buenos_Aires

VITE_API_URL=http://host.docker.internal:5050

# Backend Envs
TZ=America/Argentina/Buenos_Aires

MONGO_HOST=flag-oracle-db
MONGO_PORT=27017
MONGO_USER=admin
MONGO_PASS=secret123
MONGO_DB_NAME=flags
MONGO_AUTH_SOURCE=admin

HOST=0.0.0.0
PORT=5050
MAX_CONTENT_LENGTH=1048576
SEED_DEFAULT_DATA=false
```

## Architecture & Design Patterns

The frontend is a single-page application built with **React 19 + TypeScript**, using hash-based routing and the Context API for state management. All communication with the server goes through a thin service layer that calls the REST API via the native `fetch` API — no external HTTP libraries.

The backend is a **Flask** REST API organized in a strict four-layer architecture (Blueprints → Controllers → Services → DAOs). Data is validated with **Pydantic v2** models at every boundary. **MongoDB** stores flags, modes, and users; the database is seeded automatically with the default flag catalogue and game modes on first startup.

The entire stack runs in **Docker**: a development compose file spins up the Vite dev server (port 3000), the Flask API (port 5050), MongoDB (port 27017), and Mongo Express (port 8081) with a single command. A production compose file replaces the dev server with an **Nginx** static build and serves the Flask API through **Gunicorn**.

## Documentation API

### Version

```ts
APP VERSION: 0.0.1
README UPDATED: 18/05/2026
AUTHOR: Diego Libonati
```

### Flag Oracle Endpoints

The backend exposes the following REST endpoints (all mounted under `/api/v1/`).

---

- **Endpoint Name**: Health Check
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/health/
- **Endpoint Fn**: Liveness probe used by Docker `HEALTHCHECK` and external monitors. Returns 200 when the application is up.
- **Endpoint Params**: None

---

- **Endpoint Name**: Get Flags
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/flags/
- **Endpoint Fn**: This endpoint obtains all the flags
- **Endpoint Params**: None

---

- **Endpoint Name**: Get Random Flags
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/flags/random/:quantity
- **Endpoint Fn**: This endpoint obtains random flags by quantity
- **Endpoint Params**:

```ts
{
  quantity: number;
}
```

---

- **Endpoint Name**: Create Flag
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/flags/
- **Endpoint Fn**: This endpoint create a new Flag
- **Endpoint Body**:

```ts
{
  name: string;
  image: string;
}
```

---

- **Endpoint Name**: Delete Flag
- **Endpoint Method**: DELETE
- **Endpoint Prefix**: /api/v1/flags/:id
- **Endpoint Fn**: This endpoint deletes a Flag by id
- **Endpoint Params**:

```ts
{
  id: string;
}
```

---

- **Endpoint Name**: Get Modes
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/modes/
- **Endpoint Fn**: This endpoint obtains all the modes
- **Endpoint Params**: None

---

- **Endpoint Name**: Get Mode
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/modes/:idMode
- **Endpoint Fn**: This endpoint obtains a mode by id
- **Endpoint Params**:

```ts
{
  quantity: idMode;
}
```

---

- **Endpoint Name**: Create Mode
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/modes/
- **Endpoint Fn**: This endpoint create a new Mode
- **Endpoint Body**:

```ts
{
  name: string;
  description: string;
  timeleft: number;
  multiplier: number;
}
```

---

- **Endpoint Name**: Get Top Ten Mode
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/modes/:idMode
- **Endpoint Fn**: This endpoint obtains the top ten of the mode by id
- **Endpoint Params**:

```ts
{
  id: string;
}
```

---

- **Endpoint Name**: Delete Mode
- **Endpoint Method**: DELETE
- **Endpoint Prefix**: /api/v1/modes/:id
- **Endpoint Fn**: This endpoint deletes a Mode by id
- **Endpoint Params**:

```ts
{
  id: string;
}
```

---

- **Endpoint Name**: Create User
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/users/
- **Endpoint Fn**: This endpoint create a new User
- **Endpoint Body**:

```ts
{
  username: string;
  password: string;
  score: number;
  mode_id: string;
}
```

---

- **Endpoint Name**: Update User
- **Endpoint Method**: PATCH
- **Endpoint Prefix**: /api/v1/users/
- **Endpoint Fn**: This endpoint update a new User
- **Endpoint Body**:

```ts
{
  username: string;
  password: string;
  score: number;
  mode_id: string;
}
```

---

- **Endpoint Name**: Get Top Ten Global
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/users/top_global
- **Endpoint Fn**: This endpoint obtains the top general
- **Endpoint Params**: None

---

- **Endpoint Name**: Delete User
- **Endpoint Method**: DELETE
- **Endpoint Prefix**: /api/v1/users/:id
- **Endpoint Fn**: This endpoint deletes a User by id
- **Endpoint Params**:

```ts
{
  id: string;
}
```

---

## Testing

Both sub-projects ship with their own test suites. Run them from the relevant package folder.

### Frontend

1. Navigate to `flag-oracle-app/`.
2. Execute: `npm test`.

For the coverage report:

```bash
npm run test:coverage
```

### Backend

The backend tests reuse the virtual environment created during [Getting Started](#getting-started).

1. Navigate to `flag-oracle-api/`.
2. Activate the virtual environment (`venv\Scripts\activate` on Windows).
3. Execute: `pytest --log-cli-level=INFO`.

### Type checking (Frontend)

Run the TypeScript compiler in `--noEmit` mode to verify there are no type errors without producing a build:

```bash
npm run type-check
```

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch and validates the backend, the frontend, and all Docker images that ship the stack.

### Pipeline overview

```
                  ┌─── PR or push to main ───┐
                  ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  backend-lint-and-audit  │─▶│       backend-test       │
│  ruff · mypy · pip-audit │  │      pytest -v -ra       │
└──────────────────────────┘  └──────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────┐
│ frontend-lint-and-audit  │─▶│      frontend-test       │─▶│  frontend-build  │
│ eslint · tsc · npm audit │  │     jest --verbose       │  │   tsc + vite     │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────┘
                                                                     │
                                                                     ▼
                                                  ┌──────────────────────────────────┐
                                                  │           docker-build           │
                                                  │  api:dev · api:prod ·            │
                                                  │  app:dev · app:prod (matrix x4)  │
                                                  └──────────────────────────────────┘
```

### Backend jobs

1. **`backend-lint-and-audit`** — runs from `flag-oracle-api/` after `pip install -e ".[dev]"`. Executes `ruff check .`, `ruff format --check .`, `mypy --config-file=pyproject.toml .`, and `pip-audit --skip-editable` with a curated list of `--ignore-vuln` flags for known and accepted advisories.
2. **`backend-test`** — installs the test extras (`pip install -e ".[test]"`) and runs `python -m pytest --tb=short`. The Mongo test container is launched by the `conftest.py` autouse fixture, so no extra service is wired in the workflow.

### Frontend jobs

3. **`frontend-lint-and-audit`** — runs from `flag-oracle-app/` after `npm ci --ignore-scripts`. Executes `npm run lint` (ESLint), `npm run type-check` (TypeScript `--noEmit`), and `npm audit --audit-level=high` (advisory, not fatal).
4. **`frontend-test`** — runs `npm run test`, which invokes Jest with the MSW + jsdom setup configured in `__tests__/jest.setup.ts`.
5. **`frontend-build`** — runs `npm run build` (`tsc -p tsconfig.app.json && vite build`) to verify the production bundle compiles.

### Docker jobs

6. **`docker-build`** — a parallel matrix of four images, each gated by `frontend-build`:

   | Project | Dockerfile | Tag |
   |---|---|---|
   | `flag-oracle-api` | `Dockerfile.development` | `flag-oracle-api:dev` |
   | `flag-oracle-api` | `Dockerfile.production`  | `flag-oracle-api:prod` |
   | `flag-oracle-app` | `Dockerfile.development` | `flag-oracle-app:dev` |
   | `flag-oracle-app` | `Dockerfile.production`  | `flag-oracle-app:prod` |

   Images are built with `docker/build-push-action@v6` and **not pushed** — this is a smoke test that the Dockerfiles still produce a valid image with the current code.

### Pinning

- **Python**: `flag-oracle-api/.python-version` (3.11) is consumed by `actions/setup-python`.
- **Node.js**: `flag-oracle-app/.nvmrc` (22) is consumed by `actions/setup-node`.
- **Pip cache**: keyed off `flag-oracle-api/pyproject.toml`.
- **npm cache**: keyed off `flag-oracle-app/package-lock.json`.

### Running the same checks locally

```bash
# backend-lint-and-audit (from flag-oracle-api/, venv activated)
ruff check .
ruff format --check .
mypy --config-file=pyproject.toml .
pip-audit --skip-editable

# backend-test
python -m pytest --tb=short

# frontend-lint-and-audit (from flag-oracle-app/)
npm run lint
npm run type-check
npm audit --audit-level=high

# frontend-test
npm run test

# frontend-build
npm run build

# docker-build (from repo root)
docker build -f flag-oracle-api/Dockerfile.development -t flag-oracle-api:dev flag-oracle-api
docker build -f flag-oracle-api/Dockerfile.production  -t flag-oracle-api:prod flag-oracle-api
docker build -f flag-oracle-app/Dockerfile.development -t flag-oracle-app:dev flag-oracle-app
docker build -f flag-oracle-app/Dockerfile.production  -t flag-oracle-app:prod flag-oracle-app
```

### Skipping a CI run

To push a change to `main` without triggering the workflow (for example, a doc-only commit you have already validated), append `[skip ci]` to the commit message — this is GitHub's native marker and skips the entire pipeline.

```bash
git commit -m "docs: fix typo in README [skip ci]"
```

## Security Audit

Run a vulnerability scan against both sub-projects before any release.

### Backend (Python)

Check Python dependencies for known vulnerabilities using **pip-audit**.

1. Go to the `flag-oracle-api/` folder.
2. Activate the virtual environment.
3. Execute: `pip install -e ".[dev]"`.
4. Execute: `pip-audit --skip-editable`.

### Frontend

#### npm audit

Check the npm dependencies:

```bash
npm audit
```

#### React Doctor

Run a health check on the frontend project (security, performance, dead code, architecture):

```bash
npm run doctor
```

Use `--verbose` to see specific files and line numbers:

```bash
npm run doctor -- --verbose
```

## Production

The full stack is dockerized. Before deploying, make sure you have run the [Testing](#testing) and [Security Audit](#security-audit) steps and that the `.env` files described in [Env Keys](#env-keys) exist for both sub-projects.

Run all commands from the project root (the folder containing the compose files).

### Development

```bash
docker-compose -f dev.docker-compose.yml build --no-cache
docker-compose -f dev.docker-compose.yml up --force-recreate
```

This boots the Vite dev server (`:3000`), the Flask API (`:5050`), MongoDB (`:27017`), and Mongo Express (`:8081`).

### Production

```bash
docker-compose -f prod.docker-compose.yml up --build
```

The production stack swaps Vite for an **Nginx** static build of the frontend and serves the Flask API through **Gunicorn**.

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/flag-oracle`](https://www.diegolibonati.com.ar/#/project/flag-oracle)
