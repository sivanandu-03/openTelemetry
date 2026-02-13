import os
from flask import Flask, jsonify
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor

resource = Resource.create({"service.name": os.getenv("SERVICE_NAME", "notification-service")})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint=os.getenv("OTLP_EXPORTER_ENDPOINT"), insecure=True))
# Fixed method name from addSpanProcessor to add_span_processor
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
     
app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "UP"}), 200

@app.route('/send', methods=['POST'])
def send_notification():
    return jsonify({"message": "Notification sent successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8003)