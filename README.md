# Flag Oracle

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

1. Clone the repository with `git clone "repository link"`
2. Join to `flag-oracle-app` folder and execute: `npm install` or `yarn install` in the terminal
3. Go to the previous folder and execute: `docker-compose -f dev.docker-compose.yml build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yml` and you need to install `Docker Desktop` if you are in Windows.

### Pre-Commit for Development (Python)

NOTE: Install **pre-commit** inside: `flag-oracle-api` folder.

1. Once you're inside the virtual environment, let's install the hooks specified in the pre-commit. Execute: `pre-commit install`
2. Now every time you try to commit, the pre-commit lint will run. If you want to do it manually, you can run the command: `pre-commit run --all-files`

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

### Architecture

The frontend is a single-page application built with **React 19 + TypeScript**, using hash-based routing and the Context API for state management. All communication with the server goes through a thin service layer that calls the REST API via the native `fetch` API — no external HTTP libraries.

The backend is a **Flask** REST API organized in a strict four-layer architecture (Blueprints → Controllers → Services → DAOs). Data is validated with **Pydantic v2** models at every boundary. **MongoDB** stores flags, modes, and users; the database is seeded automatically with the default flag catalogue and game modes on first startup.

The entire stack runs in **Docker**: a development compose file spins up the Vite dev server (port 3000), the Flask API (port 5050), MongoDB (port 27017), and Mongo Express (port 8081) with a single command. A production compose file replaces the dev server with an **Nginx** static build and serves the Flask API through **Gunicorn**.

## Technologies used

1. React JS
2. Typescript
3. CSS3
4. HTML5
5. Vite

BackEnd:

1. Python -> Flask

Deploy:

1. Docker
2. Nginx
3. Gunicorn

Database:

1. MongoDB -> PyMongo

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
"husky": "^9.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"prettier": "^3.0.0"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"vite": "^7.1.6"
```

### Backend

#### Requirements.txt

```
flask==3.1.3
pymongo==4.16.0
pydantic==2.11.9
werkzeug==3.1.6
gunicorn==23.0.0
```

#### Requirements.dev.txt

```
pre-commit==4.3.0
pip-audit==2.7.3
ruff==0.11.12
```

#### Requirements.test.txt

```
pytest==8.4.2
pytest-env==1.1.5
pytest-cov==4.1.0
pytest-timeout==2.3.1
pytest-xdist==3.5.0
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/flag-oracle`](https://www.diegolibonati.com.ar/#/project/flag-oracle)

## Testing

### Frontend

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

### Backend

1. Join to the correct path of the clone and join to: `flag-oracle-api`
2. Execute: `python -m venv venv`
3. Execute in Windows: `venv\Scripts\activate`
4. Execute: `pip install -r requirements.txt`
5. Execute: `pip install -r requirements.test.txt`
6. Execute: `pytest --log-cli-level=INFO`

## Security Audit (Python)

You can check your dependencies for known vulnerabilities using **pip-audit**.

1. Go to the repository folder
2. Activate your virtual environment
3. Execute: `pip install -r requirements.dev.txt`
4. Execute: `pip-audit -r requirements.txt`

## Security Audit (Frontend)

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

### React Doctor (Frontend)

Run a health check on the project (security, performance, dead code, architecture):

```bash
npm run doctor
```

Use `--verbose` to see specific files and line numbers:

```bash
npm run doctor -- --verbose
```

## Documentation API

### **Version**

```ts
APP VERSION: 0.0.1
README UPDATED: 02/02/2026
AUTHOR: Diego Libonati
```

### **Env Keys**

1. `TZ`: Refers to the timezone setting for the container.
2. `VITE_API_URL`: Refers to the base URL of the backend API the frontend consumes.
3. `MONGO_HOST`: Specifies the hostname or address where the MongoDB server is located. In this case, `host.docker.internal` allows a Docker container to connect to the host machine.
4. `MONGO_PORT`: Defines the port on which the MongoDB server is listening for connections. The default MongoDB port is `27017`.
5. `MONGO_USER`: Indicates the username for authenticating with the MongoDB database.
6. `MONGO_PASS`: Contains the password associated with the user specified in `MONGO_USER` for authentication.
7. `MONGO_DB_NAME`: Specifies the name of the database to which the application will connect within the MongoDB server.
8. `MONGO_AUTH_SOURCE`: Defines the database where the user credentials will be verified. Typically set to `admin` when the credentials were created in that database.
9. `HOST`: Refers to the network interface where the backend API listens (e.g., 0.0.0.0 to allow external connections).
10. `PORT`: Refers to the port on which the backend API is exposed.

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
```

### **Flag Oracle Endpoints API**

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

## Known Issues

None at the moment.
