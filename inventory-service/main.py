from fastapi import FastAPI, Response, status
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
import os

app = FastAPI()
tracer = trace.get_tracer(__name__)

@app.get("/health")
def health():
    return {"status": "UP"}

@app.post("/reserve")
def reserve(data: dict, response: Response):
    with tracer.start_as_current_span("inventory_check") as span:
        items = data.get('items', [])
        if any(item.get('sku') == 'OUT_OF_STOCK' for item in items):
            span.set_status(trace.StatusCode.ERROR)
            span.set_attribute("error", True)
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"error": "Out of stock"}
        
        span.add_event("inventory_checked")
        return {"status": "ok"}

FastAPIInstrumentor.instrument_app(app)