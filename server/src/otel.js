// OpenTelemetry setup: sends this API's error logs and request metrics to the
// AIDevOps monitoring server (https://github.com/adityakasralkar/aidevops-monitoring).
//
// Must be required before express and pg (see index.js) so their
// instrumentation is active. It does nothing unless AIDEVOPS_API_KEY is set,
// so tests and local runs without monitoring are unaffected.
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { logs, SeverityNumber } = require('@opentelemetry/api');
const { version } = require('../package.json');

const apiKey = process.env.AIDEVOPS_API_KEY;
const endpoint = (process.env.AIDEVOPS_URL || 'http://localhost:8080').replace(/\/+$/, '');
const enabled = Boolean(apiKey);

let sdk;

if (enabled) {
  const headers = { 'x-api-key': apiKey };

  sdk = new NodeSDK({
    // Who is sending: the service name and the deployed version, so errors
    // can be traced back to the deployment that introduced them.
    resource: resourceFromAttributes({
      'service.name': process.env.OTEL_SERVICE_NAME || 'freelanceflow-api',
      'service.version': process.env.APP_VERSION || version,
      'deployment.environment': process.env.NODE_ENV || 'development',
    }),
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({ url: `${endpoint}/v1/logs`, headers }),
      }),
    ],
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics`, headers }),
        exportIntervalMillis: Number(process.env.AIDEVOPS_METRICS_INTERVAL_MS) || 15000,
      }),
    ],
    // AIDevOps stores logs and metrics only; no traces are exported.
    spanProcessors: [],
    // Automatic request duration and count metrics for http, express and pg.
    instrumentations: [getNodeAutoInstrumentations({ '@opentelemetry/instrumentation-fs': { enabled: false } })],
  });
  sdk.start();
  console.log(`AIDevOps monitoring enabled → ${endpoint}`);
}

const logger = logs.getLogger('freelanceflow-api');

// Sends an error to AIDevOps. Server errors (5xx) are sent as ERROR, so the
// AI layer diagnoses them; client errors (4xx) are sent as WARN.
function reportError(err, req, status = 500) {
  if (!enabled) return;
  const isServerError = status >= 500;
  logger.emit({
    severityNumber: isServerError ? SeverityNumber.ERROR : SeverityNumber.WARN,
    severityText: isServerError ? 'ERROR' : 'WARN',
    body: (err && err.message) || 'Unknown error',
    attributes: {
      'exception.type': (err && err.name) || 'Error',
      'exception.message': (err && err.message) || '',
      'exception.stacktrace': (err && err.stack) || '',
      'http.request.method': req ? req.method : '',
      'url.path': req ? req.originalUrl : '',
      'http.response.status_code': status,
    },
  });
}

// Sends any remaining data, then stops the SDK.
function shutdown() {
  return sdk ? sdk.shutdown().catch(() => {}) : Promise.resolve();
}

if (enabled) {
  // A crash is the most serious error: report it as FATAL (CRITICAL in
  // AIDevOps), send it, then exit as Node would.
  const reportCrash = (err) => {
    logger.emit({
      severityNumber: SeverityNumber.FATAL,
      severityText: 'FATAL',
      body: (err && err.message) || String(err),
      attributes: {
        'exception.type': (err && err.name) || 'Error',
        'exception.stacktrace': (err && err.stack) || '',
      },
    });
    console.error(err);
    shutdown().finally(() => process.exit(1));
  };
  process.on('uncaughtException', reportCrash);
  process.on('unhandledRejection', reportCrash);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => shutdown().finally(() => process.exit(0)));
  }
}

module.exports = { reportError, shutdown, enabled };
