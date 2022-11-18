# Avis

Hum to song & song sharing platform

## Table of Contents

- [Prerequisite](#prerequisite)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [FAQ](#faq)

## Prerequisite

Following are required to run this application in development:

- NodeJS (version 16.x.x)
- Dotnet (version 6)
- Python (version 3.8)
- Poetry (newest version)

## Installation

### 1. Client app - Ionic React TS

```
cd client
npm install --force
```

### 2. Main Service Api - ASP.NET Core

```
cd api/main_service
dotnet restore
```

> After restored, ask your team lead to get appsettings.development.json file and add it to `api\main_service\MainService\`

### 3. Hum Service Api - FastAPI

```
cd api/hum_service
poetry install
```

## Development

### 1. Client app - Ionic React TS

```
cd client
npm start
```

### 2. Main Service Api - ASP.NET Core

```
cd api/main_service/MainService
dotnet watch run
```

### 3. Hum Service Api - FastAPI

Select created Python environment `(Ctrl + Shift + P then Python:Select Interpreter)` and run app:

```
cd api/hum_service
uvicorn app.main:app --reload
```

## Testing

### 1. Front-end

For front-end testing purpose please open `client` folder then run following command:

```bash
npm run cypress:open
```

Read more about how to use Cypress in [FAQ](#faq)

### 2. Back-end

For back-end testing, install [Postman](https://www.postman.com/) then access to project workspaces using [this link](https://projectreddo.postman.co/workspace/450982ea-05d9-4ae3-9488-39309debaedb).

## FAQ

- Read more about installed components [HeadlessUI](https://headlessui.com/).

- Read more about [Cypress](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test#Add-a-test-file)
