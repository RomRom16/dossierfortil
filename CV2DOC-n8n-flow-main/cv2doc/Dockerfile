FROM python:3.13-slim

WORKDIR /app

# Install uv (Astral-supported install script)
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates
ADD https://astral.sh/uv/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Copy the project into the image
COPY . /app

ENV PATH="/root/.local/bin:${PATH}"

# Sync the project into a new environment, asserting the lockfile is up to date
WORKDIR /app
RUN uv sync --locked


# Default command: run your entrypoint via uv
CMD ["uv", "run", "python", "main.py"]
