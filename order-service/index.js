const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const api = require('@opentelemetry/api');

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'order-service',
  }),
  traceExporter: new OTLPTraceExporter({ url: process.env.OTLP_EXPORTER_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();

const express = require('express');
const app = express();
app.use(express.json());

const tracer = api.trace.getTracer('order-logic');

app.get('/health', (req, res) => res.json({ status: "UP" }));

app.post('/process', (req, res) => {
  tracer.startActiveSpan('process_order', (span) => {
    const orderId = "ORD-" + Math.floor(Math.random() * 10000);
    span.setAttribute("user.id", req.body.userId);
    span.setAttribute("order.id", orderId);
    span.addEvent("order_persisted");
    span.setStatus({ code: api.SpanStatusCode.OK });
    span.end();
    res.status(201).json({ orderId });
  });
});

app.listen(8002);