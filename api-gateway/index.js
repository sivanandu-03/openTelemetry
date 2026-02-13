const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'api-gateway',
  }),
  traceExporter: new OTLPTraceExporter({ url: process.env.OTLP_EXPORTER_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: "UP" }));

app.post('/api/orders', async (req, res) => {
  try {
    await axios.post(`${process.env.INVENTORY_URL}/reserve`, req.body);
    const orderRes = await axios.post(`${process.env.ORDER_URL}/process`, req.body);
    await axios.post(`${process.env.NOTIFICATION_URL}/send`, req.body);
    
    const activeSpan = require('@opentelemetry/api').trace.getSpan(require('@opentelemetry/api').context.active());
    const traceId = activeSpan ? activeSpan.spanContext().traceId : "no-trace";

    res.status(201).json({ 
      orderId: orderRes.data.orderId, 
      status: "CREATED", 
      traceId: traceId 
    });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Order failed" });
  }
});

app.listen(8080);