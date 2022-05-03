# Avis

Hum to song project

## 1. Installation

> Every installation part will start from root folder.

### 1.1 Client app - Ionic React TS

```
cd client
npm install
```

_If there is an error about not found **NPM** you can read NPM install guide at the Q&A part_

### 1.2 Main Api - ASP.NET Core

```
cd api/main_service
dotnet restore
```

_If there is an error about not found **Dotnet** you can read Dotnet install guide at the Q&A part_

### 1.3 Hum Api - FastAPI

```
cd api/hum_service
poetry shell
poetry install
```

_If there is an error about not found **Poetry** you can read Poetry install guide at the Q&A part_

## 2. Run app in development

> Every run part will start from root folder.

### 2.1 Client app - Ionic React TS

```
cd app
ionic serve
```

_If there is an error about not found **Ionic** you can read Ionic install guide at the Q&A part_

### 2.2 Main Api - ASP.NET Core

```
cd api/main_service
dotnet watch run
```

### 2.3 Hum Api - FastAPI

> When you re-open project in any IDE you need to run following command to re-create the virtual environment if it NOT DETECTED:

```
cd api/hum_service
poetry shell
```

-   Run development server:

```
uvicorn hum_service.app:app --reload
```

## Q & A

-   Install NodeJS (ver 16.\*) - NPM included: [this link](https://nodejs.org/en/download/).

---

-   Install Ionic CLI: [this link](https://ionicframework.com/docs/cli)

> **NOTE:** You must have NPM installed on your computer before install Ionic CLI.

---

-   Install Python (ver 3.8): [this link](https://www.python.org/downloads/)

---

-   Install Poetry: [this link](https://python-poetry.org/docs/)

> **NOTE:** You must have Python installed on your computer before install Poetry.

---

-   Install Dotnet (ver 6.0): [this link](https://dotnet.microsoft.com/en-us/download)

---

-   Install Docker: [this link](https://docs.docker.com/get-docker/)
