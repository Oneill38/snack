const fs = require('fs');
const path = require('path');
const { GetEnvVars } = require('env-cmd');

module.exports = (async function () {
  const baseEnv = await GetEnvVars({ envFile: { filePath: './k8s/base/snackager.env' } });
  const baseSecrets = {
    SENTRY_DSN: fs.readFileSync('./k8s/base/secrets/SENTRY_DSN').toString(),
    REDIS_TLS_CA: path.join(__dirname, './k8s/base/redislabs_ca.pem'),
  };
  const stagingEnv = await GetEnvVars({ envFile: { filePath: './k8s/staging/snackager.env' } });
  const stagingSecrets = await GetEnvVars({
    envFile: { filePath: './k8s/staging/secrets/snackager.env' },
  });
  return {
    development: {
      NODE_ENV: 'development',
      ...baseEnv,
      ...baseSecrets,
      ...stagingEnv,
      ...stagingSecrets,
    },
    test: {
      NODE_ENV: 'test',
    },
    production: {
      NODE_ENV: 'production',
    },
  };
})();
