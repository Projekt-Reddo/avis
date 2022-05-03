# STAGE requirements.txt generation
FROM python:3.8-slim as requirements-state

WORKDIR /tmp

RUN pip install poetry

COPY ./api/hum_service/pyproject.toml /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# STAGE Build container
FROM python:3.8-slim

# Install libs for handle MIME types & 2 Sound libs
RUN apt-get update && apt-get install -y libmagic1 libsndfile1 ffmpeg

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1
ENV AWS_ACCESS_KEY_ID=AKIA5ZUVKA73DF7V52UD
ENV AWS_REGION=us-east-1
ENV AWS_SECRET_ACCESS_KEY=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

WORKDIR /code

# Install pip requirements
COPY --from=requirements-state /tmp/requirements.txt /code/requirements.txt
RUN python -m pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./api/hum_service/hum_service /code/hum_service
COPY ./api/hum_service/hum2song /code/hum2song

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /code
USER appuser

# For local debugging, use the following entry point:
# CMD ["uvicorn", "hum_service.app:app", "--host", "0.0.0.0", "--port", "80"]

# For production with Heroku container:
CMD uvicorn hum_service.app:app --host 0.0.0.0 --port $PORT