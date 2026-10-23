// Reports the result of a CI run to the AIDevOps monitoring server.
//
// A failed pipeline is sent as CRITICAL (the push cannot be deployed), with
// the commit, branch, author, the failed step and the end of its output,
// so the problem is traced back to the exact push that caused it.
// A passing pipeline is sent as INFO, giving a record of every deployable push.
//
// Never fails the job itself: if AIDevOps is unreachable it only warns.
const fs = require('fs');
const path = require('path');

const url = (process.env.AIDEVOPS_URL || '').replace(/\/+$/, '');
const apiKey = process.env.AIDEVOPS_API_KEY;
const logDir = process.env.CI_LOG_DIR || 'ci-logs';

// Step id → readable name and how serious its failure is.
const STEPS = {
  install: { name: 'Install dependencies', severity: 'CRITICAL' },
  server_tests: { name: 'Server tests', severity: 'CRITICAL' },
  client_lint: { name: 'Client lint', severity: 'ERROR' },
  client_tests: { name: 'Client tests', severity: 'CRITICAL' },
  client_build: { name: 'Client build', severity: 'CRITICAL' },
  secret_scan: { name: 'Security: secret scan', severity: 'CRITICAL' },
  dependency_audit: { name: 'Security: vulnerable dependencies', severity: 'CRITICAL' },
};

function tail(file, lines = 60) {
  try {
    return fs.readFileSync(file, 'utf8').trimEnd().split('\n').slice(-lines).join('\n');
  } catch {
    return '';
  }
}

// The most useful single line of a failed step's output.
function firstErrorLine(output) {
  const line = output
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /(SECRET FOUND|✕|FAIL|error|critical|high|vulnerabilit)/i.test(l));
  return line ? line.slice(0, 300) : '';
}

async function main() {
  if (!url || !apiKey) {
    console.log('AIDEVOPS_URL or AIDEVOPS_API_KEY not set; skipping report.');
    return;
  }

  const steps = JSON.parse(process.env.STEPS_JSON || '{}');
  const failed = Object.entries(steps)
    .filter(([, s]) => s.outcome === 'failure')
    .map(([id]) => ({ id, ...(STEPS[id] || { name: id, severity: 'CRITICAL' }) }));

  const env = process.env;
  const sha = env.GITHUB_SHA || '';
  const short = sha.slice(0, 7);
  const branch = env.GITHUB_REF_NAME || '';
  const runUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`;
  const attributes = {
    'ci.pipeline': env.GITHUB_WORKFLOW || 'CI',
    'ci.run.id': env.GITHUB_RUN_ID || '',
    'ci.run.url': runUrl,
    'vcs.repository': env.GITHUB_REPOSITORY || '',
    'vcs.branch': branch,
    'vcs.commit.sha': sha,
    'vcs.commit.author': env.GITHUB_ACTOR || '',
    'vcs.commit.message': (env.COMMIT_MESSAGE || '').split('\n')[0].slice(0, 200),
  };

  const logs = failed.length
    ? failed.map((step) => {
        const output = tail(path.join(logDir, `${step.id}.log`));
        const detail = firstErrorLine(output);
        return {
          service_name: 'freelanceflow-ci',
          severity: step.severity,
          message: `Pipeline failed at "${step.name}" for commit ${short} on ${branch}${detail ? `: ${detail}` : ''}`,
          stack_trace: output,
          attributes: { ...attributes, 'ci.failed_step': step.name },
        };
      })
    : [
        {
          service_name: 'freelanceflow-ci',
          severity: 'INFO',
          message: `Pipeline passed for commit ${short} on ${branch}; ready to deploy`,
          attributes,
        },
      ];

  try {
    const res = await fetch(`${url}/api/v1/telemetry/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify(logs),
      signal: AbortSignal.timeout(5000),
    });
    console.log(`Reported ${logs.length} result(s) to AIDevOps: HTTP ${res.status}`);
  } catch (err) {
    console.warn(`::warning::Could not report to AIDevOps: ${err.message}`);
  }
}

main();
