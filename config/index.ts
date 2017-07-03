import * as path from 'path';
import * as nconf from 'nconf';

const env = process.env.NODE_ENV;

nconf
.env()
.file({ file: path.resolve(__dirname, `${env}.json`) })
.defaults({
  PORT: 3000
});
