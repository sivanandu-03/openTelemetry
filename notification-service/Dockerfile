FROM python:3.10-slim
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY requirements.txt .
ENV PIP_DEFAULT_TIMEOUT=1000
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8003
# Use python directly for the Flask app
CMD ["python", "main.py"]