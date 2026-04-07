# FlagsGame

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

1. Clone the repository with `git clone "repository link"`
2. Join to `flags-game-app` folder and execute: `npm install` or `yarn install` in the terminal
3. Go to the previous folder and execute: `docker-compose -f dev.docker-compose.yml build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yml` and you need to install `Docker Desktop` if you are in Windows.

### Pre-Commit for Development (Python)

NOTE: Install **pre-commit** inside: `flags-server` folder.

1. Once you're inside the virtual environment, let's install the hooks specified in the pre-commit. Execute: `pre-commit install`
2. Now every time you try to commit, the pre-commit lint will run. If you want to do it manually, you can run the command: `pre-commit run --all-files`

## Description

I made a web application with React JS and Flask for the api-rest, I used mongodb to save the information. In this web application you can play guess the flag, there are a total of 3 game modes among them we have normal, hard and hardcore mode. In each of them will appear 5 flags and depending on the game mode will have more or less time. In game modes with a higher difficulty the points multiplier will be higher, because every time you guess a flag you add points. In each game mode there is a ranking and there is also a global ranking of players that is governed by the amount of points they score.

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

[`https://www.diegolibonati.com.ar/#/project/FlagsGame`](https://www.diegolibonati.com.ar/#/project/FlagsGame)

## Video

https://user-images.githubusercontent.com/99032604/199865818-646e2a21-c6a4-42d6-976d-3b4861c5990c.mp4

## Testing

### Frontend

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

### Backend

1. Join to the correct path of the clone and join to: `flags-server`
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

MONGO_HOST=flags-db
MONGO_PORT=27017
MONGO_USER=admin
MONGO_PASS=secret123
MONGO_DB_NAME=flags
MONGO_AUTH_SOURCE=admin

HOST=0.0.0.0
PORT=5050
```

### **Flags Endpoints API**

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
