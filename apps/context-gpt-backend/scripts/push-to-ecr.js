const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the AWS configuration
const awsConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../aws-config.json'), 'utf8'));

const { ecrRepositoryUri, awsRegion } = awsConfig;

// Execute commands
const commands = [
  `aws ecr get-login-password --region ${awsRegion} | docker login --username AWS --password-stdin ${ecrRepositoryUri}`,
  `docker tag context-gpt-backend:latest ${ecrRepositoryUri}:latest`,
  `docker push ${ecrRepositoryUri}:latest`,
];

commands.forEach((command) => {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });
});
