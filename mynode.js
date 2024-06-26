const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({path: 'src/.env'});

const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';

const envFileContent = `export const environment = {
    production: ${process.env.production},
    api_url: '${process.env.api_url}',
  };
`;

const targetPath = path.join(__dirname, './src/environments/environment.ts');
fs.writeFile(targetPath, envFileContent, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment.ts`);
  }
});
