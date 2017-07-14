import * as fs from 'fs';
import * as path from 'path';
import * as nconf from 'nconf';

const readFile = file => fs.readFileSync(path.resolve(__dirname, file), 'utf8');
const env = process.env.NODE_ENV;

nconf
.env()
.file({ file: path.resolve(__dirname, `${env}.json`) })
.defaults({
  PORT: 8082,
  TLS_CERT: readFile('certs/dev.cert.pem'),
  TLS_KEY: readFile('certs/dev.key.pem')
});
