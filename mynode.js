const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({path: './src/.env'});

const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';

// Verify that dotenv loaded the environment variables
if (dotenv.error) {
    console.error("Error loading .env file", dotenv.error);
    process.exit(1);
}


// Check for required environment variables
const requiredEnvVars = ['production', 'api_url'];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`Missing required environment variable: ${varName}`);
        process.exit(1);
    }
}

const envFileContent = `export const environment = {
    production: '${process.env.production}',
    api_url: '${process.env.api_url}',
  };
`;

const targetPath = path.join(__dirname, './src/environments/environment.prod.ts');
fs.writeFile(targetPath, envFileContent, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment.prod.ts`);
  }
});
