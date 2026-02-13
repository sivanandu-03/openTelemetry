# 🌐 Polyglot Microservices Observability with OpenTelemetry & Jaeger

This project is a comprehensive implementation of **Distributed Tracing** in a polyglot microservices environment. It demonstrates how to achieve end-to-end observability across services written in different languages (**Node.js** and **Python**) using the **OpenTelemetry** (OTEL) framework and **W3C Trace Context** propagation.

---

## 🏗️ Architecture & Request Flow

The system simulates a high-level E-commerce order processing workflow. Each service is containerized using Docker and communicates over an internal virtual network.

1.  **API Gateway (Node.js/Express)**: 
    * The entry point for all client requests.
    * Responsible for starting the root span and orchestrating calls to downstream services.
    * Returns the `traceId` to the client for immediate tracking.
2.  **Inventory Service (Python/FastAPI)**: 
    * Performs stock verification.
    * Demonstrates **Error Handling**: If an item is marked "OUT_OF_STOCK", the span is automatically marked as an error in Jaeger.
3.  **Order Service (Node.js/Express)**: 
    * Processes order logic.
    * Implements **Manual Instrumentation**: Uses a custom span (`process_order`) with specific business attributes (`user.id`, `order.id`) and events (`order_persisted`).
4.  **Notification Service (Python/Flask)**: 
    * Simulates sending a confirmation. 
    * Completes the trace chain.
5.  **Jaeger (Collector & UI)**: 
    * Receives OTLP data via gRPC (Port 4317) and provides the visualization dashboard (Port 16686).



---

## 🛠️ Tech Stack

* **Languages**: Node.js (v18+), Python (3.10-slim)
* **Frameworks**: Express.js, FastAPI, Flask
* **Observability**: OpenTelemetry SDKs (Auto & Manual), OTLP Exporters
* **Infrastructure**: Docker, Docker Compose
* **Analysis**: Bash, cURL, Regex

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Git Bash (for Windows users) or a Linux terminal

### 2. Deployment
Build and launch the entire stack with a single command:
```bash
docker-compose up --build -d

```

*The `-d` flag runs the services in the background.*

### 3. Verify Health

Ensure all 5 containers are healthy:

```bash
docker-compose ps

```

---

## 🔍 Verification Guide

### Step 1: Trigger a Successful Trace

Run this in PowerShell to process a valid order:

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/orders" -Method Post -ContentType "application/json" -Body '{
  "userId": 101,
  "items": [{"sku": "laptop", "quantity": 1}],
  "email": "test@test.com"
}'

```

**Success Response:**

```json
{
  "orderId": "ORD-5279",
  "status": "CREATED",
  "traceId": "92d247731ddd330fb6777072cf4684c9"
}

```

### Step 2: Automated Performance Analysis

Run the provided shell script to filter traces that took longer than 100ms. This uses a `cURL` + `Regex` approach to ensure compatibility without requiring `jq`:

```bash
chmod +x analyze-traces.sh
./analyze-traces.sh 100

```

### Step 3: Visual Trace Inspection

1. Open **`http://localhost:16686`** in your browser.
2. Select **`api-gateway`** from the service list.
3. Find the trace matching your `traceId`.
4. Expand the **`order-service`** span to see custom tags like `user.id: 101`.

---
      
## 📝 Mandatory Compliance Checklist

* **[✅] Polyglot Integration**: Successful communication between Node.js and Python.
* **[✅] Context Propagation**: W3C headers passed across all 4 services.
* **[✅] Service Naming**: Fixed `unknown_service:node` using OTEL Resource attributes.
* **[✅] Custom Instrumentation**: Manual span and attribute injection in the Order Service.
* **[✅] Error Observability**: Inventory service correctly flags error spans.

---

## 📂 Project Structure

```text
.
├── api-gateway/          # Node.js Gateway logic
├── inventory-service/    # Python stock management
├── order-service/        # Node.js business logic
├── notification-service/ # Python alerting
├── analyze-traces.sh     # Performance analysis script
├── docker-compose.yml    # Container orchestration
└── submission.json       # Final test results

```

---

## 🏁 Final Submission Data

* **Valid Order ID**: `ORD-5279`
* **Trace ID**: `92d247731ddd330fb6777072cf4684c9`

```

Would you like me to help you create a **video demonstration script** or a **PowerPoint outline** to go along with this README for your submission?

```