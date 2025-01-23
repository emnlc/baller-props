# Use a lightweight Python base image
FROM python:3.12.5-slim

# Install CA certificates so we can add custom certs
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy only the requirements file to leverage Docker's caching mechanism
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Update the system-wide certificate store
RUN update-ca-certificates --fresh

EXPOSE 8080

# Specify default command
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]

