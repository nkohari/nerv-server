global.Promise = require('bluebird'); // tslint:disable-line

import './config';
import MinebossServerApplication from './src/MinebossServerApplication';

const app = new MinebossServerApplication();

app.start();
